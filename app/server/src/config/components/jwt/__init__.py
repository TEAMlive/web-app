from datetime import timedelta
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings

from src.config.constants import ROOT_DIR


class JWTConfig(BaseSettings):
    private_key: Path = Field(default=ROOT_DIR / 'certs' / 'jwt-private.pem')
    public_key: Path = Field(default=ROOT_DIR / 'certs' / 'jwt-public.pem')
    algorithm: str = Field(default='RS256')
    access_token_ttl: timedelta = Field(default=timedelta(hours=1))
    refresh_token_ttl: timedelta = Field(default=timedelta(days=1))

__all__ = ['JWTConfig']