from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    prh_base_url: str = "https://avoindata.prh.fi/opendata-ytj-api/v3"
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
