from pydantic import BaseModel


class Address(BaseModel):
    street: str | None = None
    post_code: str | None = None
    city: str | None = None


class CompanyResult(BaseModel):
    business_id: str
    name: str
    company_form: str | None = None
    registration_date: str | None = None
    status: str | None = None
    address: Address | None = None
    website: str | None = None
    phone: str | None = None


class SearchResponse(BaseModel):
    results: list[CompanyResult]
    total_results: int
    page: int
