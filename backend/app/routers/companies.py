from fastapi import APIRouter, HTTPException, Query

from app.models.company import SearchResponse
from app.services.prh_client import PrhClient

router = APIRouter()
prh_client = PrhClient()


@router.get("/companies", response_model=SearchResponse)
async def search_companies(
    name: str | None = Query(default=None),
    business_id: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
) -> SearchResponse:
    """Search Finnish companies by name or business ID."""
    if not name and not business_id:
        raise HTTPException(
            status_code=422,
            detail="At least one of 'name' or 'business_id' must be provided",
        )

    if name:
        return await prh_client.search_by_name(name, page=page, limit=limit)

    assert business_id is not None
    return await prh_client.search_by_business_id(business_id)
