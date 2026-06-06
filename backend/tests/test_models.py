from app.models.company import Address, CompanyResult, SearchResponse


def test_company_result_optional_fields() -> None:
    company = CompanyResult(business_id="0112038-9", name="Nokia Oyj")
    assert company.business_id == "0112038-9"
    assert company.name == "Nokia Oyj"
    assert company.company_form is None


def test_address_all_none() -> None:
    address = Address()
    assert address.street is None
    assert address.post_code is None
    assert address.city is None


def test_search_response_empty() -> None:
    response = SearchResponse(results=[], total_results=0, page=1)
    assert response.results == []
    assert response.total_results == 0
