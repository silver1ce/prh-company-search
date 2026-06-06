import logging
from typing import Any

import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.models.company import Address, CompanyResult, SearchResponse

logger = logging.getLogger(__name__)

PRH_PAGE_SIZE = 100
REGISTERED_OFFICE_ADDRESS_TYPE = 1


class PrhClient:
    """HTTP client for the PRH open data YTJ API."""

    def __init__(self, base_url: str | None = None, timeout: float = 10.0) -> None:
        self._base_url = base_url or settings.prh_base_url
        self._timeout = timeout

    async def search_by_name(
        self, name: str, page: int = 1, limit: int = 20
    ) -> SearchResponse:
        """Search companies by name with client-side pagination over PRH pages."""
        prh_page, offset = _resolve_prh_page_offset(page, limit)
        data = await self._fetch_companies({"name": name, "page": prh_page})
        return _build_search_response(data, page, limit, offset)

    async def search_by_business_id(self, business_id: str) -> SearchResponse:
        """Look up a single company by Finnish business ID (Y-tunnus)."""
        data = await self._fetch_companies({"businessId": business_id})
        companies = data.get("companies", [])
        if not companies:
            raise HTTPException(status_code=404, detail="Company not found")
        return SearchResponse(
            results=[_map_company(companies[0])],
            total_results=int(data.get("totalResults", 1)),
            page=1,
        )

    async def _fetch_companies(self, params: dict[str, Any]) -> dict[str, Any]:
        """Fetch company data from PRH with one retry on timeout."""
        last_error: Exception | None = None
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(
                    base_url=self._base_url,
                    timeout=self._timeout,
                ) as client:
                    response = await client.get("/companies", params=params)
                    response.raise_for_status()
                    payload: dict[str, Any] = response.json()
                    return payload
            except httpx.TimeoutException as exc:
                last_error = exc
                logger.warning("PRH API timeout (attempt %d)", attempt + 1)
            except httpx.HTTPError as exc:
                logger.exception("PRH API request failed")
                raise HTTPException(
                    status_code=502, detail="PRH API unavailable"
                ) from exc

        logger.exception("PRH API timed out after retry")
        raise HTTPException(status_code=502, detail="PRH API unavailable") from (
            last_error
        )


def _resolve_prh_page_offset(page: int, limit: int) -> tuple[int, int]:
    """Map application page/limit to PRH page number and slice offset."""
    start_index = (page - 1) * limit
    prh_page = start_index // PRH_PAGE_SIZE + 1
    offset = start_index % PRH_PAGE_SIZE
    return prh_page, offset


def _build_search_response(
    data: dict[str, Any], page: int, limit: int, offset: int
) -> SearchResponse:
    """Map PRH response to application SearchResponse with pagination slice."""
    companies: list[dict[str, Any]] = data.get("companies", [])
    sliced = companies[offset : offset + limit]
    return SearchResponse(
        results=[_map_company(company) for company in sliced],
        total_results=int(data.get("totalResults", len(companies))),
        page=page,
    )


def _map_company(raw: dict[str, Any]) -> CompanyResult:
    """Map a PRH company object to CompanyResult."""
    business_id_obj = raw.get("businessId", {})
    business_id = business_id_obj.get("value", "")

    return CompanyResult(
        business_id=business_id,
        name=_active_name(raw.get("names", [])),
        company_form=_active_company_form(raw.get("companyForms", [])),
        registration_date=raw.get("registrationDate"),
        status=raw.get("tradeRegisterStatus") or raw.get("status"),
        address=_active_address(raw.get("addresses", [])),
        website=_website_url(raw.get("website")),
        phone=_active_phone(raw.get("contactDetails", [])),
    )


def _active_name(names: list[dict[str, Any]]) -> str:
    """Pick the current primary company name (type 1, no endDate)."""
    active = [n for n in names if n.get("endDate") is None and n.get("type") == "1"]
    if not active:
        active = [n for n in names if n.get("endDate") is None]
    if not active:
        return names[0].get("name", "") if names else ""
    active.sort(key=lambda n: n.get("version", 1))
    return str(active[0].get("name", ""))


def _active_company_form(forms: list[dict[str, Any]]) -> str | None:
    """Pick the current company form description in Finnish."""
    active = [f for f in forms if f.get("endDate") is None]
    if not active:
        return None
    active.sort(key=lambda f: f.get("version", 1))
    descriptions = active[0].get("descriptions", [])
    for desc in descriptions:
        if desc.get("languageCode") == "1":
            return str(desc.get("description")) if desc.get("description") else None
    if descriptions:
        value = descriptions[0].get("description")
        return str(value) if value else None
    form_type = active[0].get("type")
    return str(form_type) if form_type else None


def _active_address(addresses: list[dict[str, Any]]) -> Address | None:
    """Pick the registered office address (type 1), preferring active entries."""
    if not addresses:
        return None

    active = [a for a in addresses if a.get("endDate") is None]
    candidates = active if active else addresses
    registered = [
        a for a in candidates if a.get("type") == REGISTERED_OFFICE_ADDRESS_TYPE
    ]
    chosen = registered[0] if registered else candidates[0]

    city = _finnish_city(chosen.get("postOffices", []))
    street_parts = [chosen.get("street"), chosen.get("buildingNumber")]
    street = " ".join(part for part in street_parts if part) or None

    return Address(
        street=street,
        post_code=chosen.get("postCode"),
        city=city,
    )


def _finnish_city(post_offices: list[dict[str, Any]]) -> str | None:
    """Extract Finnish city name from post office entries."""
    for office in post_offices:
        if office.get("languageCode") == "1":
            return office.get("city")
    return post_offices[0].get("city") if post_offices else None


def _website_url(website: dict[str, Any] | None) -> str | None:
    """Extract website URL from PRH website object."""
    if not website:
        return None
    return website.get("url")


def _active_phone(contacts: list[dict[str, Any]]) -> str | None:
    """Extract active phone number from contact details when available."""
    active = [c for c in contacts if c.get("endDate") is None]
    for contact in active:
        if contact.get("type") in ("phone", "PHONE", "1"):
            return contact.get("value")
    return None
