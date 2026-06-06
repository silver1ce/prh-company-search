from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.models.company import Address, CompanyResult, SearchResponse

MOCK_RESPONSE = SearchResponse(
    results=[
        CompanyResult(
            business_id="0112038-9",
            name="Nokia Oyj",
            company_form="Julkinen osakeyhtiö",
            registration_date="1896-12-19",
            status="1",
            address=Address(street="Karakaari 7", post_code="02610", city="ESPOO"),
            website="www.nokia.com",
        )
    ],
    total_results=1,
    page=1,
)


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@patch("app.routers.companies.prh_client.search_by_name", new_callable=AsyncMock)
async def test_search_by_name_success(mock_search, client: AsyncClient) -> None:
    mock_search.return_value = MOCK_RESPONSE

    response = await client.get("/api/companies", params={"name": "Nokia"})

    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    assert data["results"][0]["name"] == "Nokia Oyj"


@patch(
    "app.routers.companies.prh_client.search_by_business_id",
    new_callable=AsyncMock,
)
async def test_search_by_business_id_success(
    mock_search, client: AsyncClient
) -> None:
    mock_search.return_value = MOCK_RESPONSE

    response = await client.get(
        "/api/companies", params={"business_id": "0112038-9"}
    )

    assert response.status_code == 200
    assert response.json()["results"][0]["business_id"] == "0112038-9"


async def test_missing_params_returns_422(client: AsyncClient) -> None:
    response = await client.get("/api/companies")

    assert response.status_code == 422


@patch("app.routers.companies.prh_client.search_by_name", new_callable=AsyncMock)
async def test_both_params_provided(mock_search, client: AsyncClient) -> None:
    mock_search.return_value = MOCK_RESPONSE

    response = await client.get(
        "/api/companies",
        params={"name": "Nokia", "business_id": "0112038-9"},
    )

    assert response.status_code == 200
    mock_search.assert_awaited_once()
    mock_search.assert_awaited_with("Nokia", page=1, limit=20)


@patch("app.routers.companies.prh_client.search_by_name", new_callable=AsyncMock)
async def test_prh_error_returns_502(mock_search, client: AsyncClient) -> None:
    from fastapi import HTTPException

    mock_search.side_effect = HTTPException(
        status_code=502, detail="PRH API unavailable"
    )

    response = await client.get("/api/companies", params={"name": "Nokia"})

    assert response.status_code == 502


async def test_health_endpoint(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("app.routers.companies.prh_client.search_by_name", new_callable=AsyncMock)
async def test_pagination_params(mock_search, client: AsyncClient) -> None:
    mock_search.return_value = SearchResponse(results=[], total_results=0, page=2)

    response = await client.get(
        "/api/companies", params={"name": "Nokia", "page": "2", "limit": "10"}
    )

    assert response.status_code == 200
    mock_search.assert_awaited_with("Nokia", page=2, limit=10)
