import httpx
import pytest
import respx
from fastapi import HTTPException

from app.services.prh_client import PrhClient

BASE_URL = "https://avoindata.prh.fi/opendata-ytj-api/v3"


@pytest.fixture
def prh_client() -> PrhClient:
    return PrhClient(base_url=BASE_URL)


SAMPLE_COMPANY = {
    "businessId": {"value": "0112038-9", "registrationDate": "1978-03-15"},
    "names": [
        {
            "name": "Nokia Oyj",
            "type": "1",
            "registrationDate": "1997-09-01",
            "version": 1,
        },
        {
            "name": "Oy Nokia Ab",
            "type": "1",
            "registrationDate": "1966-06-10",
            "endDate": "1997-08-31",
            "version": 2,
        },
    ],
    "companyForms": [
        {
            "type": "17",
            "descriptions": [
                {"languageCode": "1", "description": "Julkinen osakeyhtiö"},
            ],
            "registrationDate": "1997-09-01",
            "version": 1,
        }
    ],
    "addresses": [
        {
            "type": 1,
            "street": "Karakaari",
            "postCode": "02610",
            "postOffices": [{"city": "ESPOO", "languageCode": "1"}],
            "buildingNumber": "7",
        }
    ],
    "website": {"url": "www.nokia.com"},
    "registrationDate": "1896-12-19",
    "tradeRegisterStatus": "1",
    "contactDetails": [
        {"type": "phone", "value": "+358 9 123456", "endDate": None},
    ],
}


@respx.mock
async def test_search_by_name_returns_mapped_results(prh_client: PrhClient) -> None:
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(
            200,
            json={"totalResults": 1, "companies": [SAMPLE_COMPANY]},
        )
    )

    result = await prh_client.search_by_name("Nokia", page=1, limit=20)

    assert result.total_results == 1
    assert len(result.results) == 1
    company = result.results[0]
    assert company.business_id == "0112038-9"
    assert company.name == "Nokia Oyj"
    assert company.company_form == "Julkinen osakeyhtiö"
    assert company.registration_date == "1896-12-19"
    assert company.status == "1"
    assert company.address is not None
    assert company.address.street == "Karakaari 7"
    assert company.address.post_code == "02610"
    assert company.address.city == "ESPOO"
    assert company.website == "www.nokia.com"
    assert company.phone == "+358 9 123456"


@respx.mock
async def test_search_by_name_empty_results(prh_client: PrhClient) -> None:
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(200, json={"totalResults": 0, "companies": []})
    )

    result = await prh_client.search_by_name("NonexistentXYZ", page=1, limit=20)

    assert result.results == []
    assert result.total_results == 0


@respx.mock
async def test_search_by_business_id_success(prh_client: PrhClient) -> None:
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(
            200,
            json={"totalResults": 1, "companies": [SAMPLE_COMPANY]},
        )
    )

    result = await prh_client.search_by_business_id("0112038-9")

    assert len(result.results) == 1
    assert result.results[0].business_id == "0112038-9"
    assert result.page == 1


@respx.mock
async def test_search_by_business_id_not_found(prh_client: PrhClient) -> None:
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(200, json={"totalResults": 0, "companies": []})
    )

    with pytest.raises(HTTPException) as exc_info:
        await prh_client.search_by_business_id("0000000-0")

    assert exc_info.value.status_code == 404


@respx.mock
async def test_prh_network_error(prh_client: PrhClient) -> None:
    respx.get(f"{BASE_URL}/companies").mock(side_effect=httpx.ConnectError("down"))

    with pytest.raises(HTTPException) as exc_info:
        await prh_client.search_by_business_id("0112038-9")

    assert exc_info.value.status_code == 502


@respx.mock
async def test_active_address_selected(prh_client: PrhClient) -> None:
    company = {
        **SAMPLE_COMPANY,
        "addresses": [
            {
                "type": 1,
                "street": "Old Street",
                "postCode": "00100",
                "postOffices": [{"city": "HELSINKI", "languageCode": "1"}],
                "endDate": "2020-01-01",
            },
            {
                "type": 1,
                "street": "New Street",
                "postCode": "00200",
                "postOffices": [{"city": "ESPOO", "languageCode": "1"}],
            },
        ],
    }
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(
            200, json={"totalResults": 1, "companies": [company]}
        )
    )

    result = await prh_client.search_by_business_id("0112038-9")

    assert result.results[0].address is not None
    assert result.results[0].address.street == "New Street"
    assert result.results[0].address.city == "ESPOO"


@respx.mock
async def test_active_name_selected(prh_client: PrhClient) -> None:
    company = {
        **SAMPLE_COMPANY,
        "names": [
            {
                "name": "Current Name Oy",
                "type": "1",
                "version": 1,
            },
            {
                "name": "Old Name Oy",
                "type": "1",
                "endDate": "2020-01-01",
                "version": 2,
            },
        ],
    }
    respx.get(f"{BASE_URL}/companies").mock(
        return_value=httpx.Response(
            200, json={"totalResults": 1, "companies": [company]}
        )
    )

    result = await prh_client.search_by_business_id("0112038-9")

    assert result.results[0].name == "Current Name Oy"
