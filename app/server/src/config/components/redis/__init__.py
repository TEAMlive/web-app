from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class RedisConfig(BaseSettings):
    host: str = Field(default='localhost')
    port: int | str = Field(default=6379)
    password: Optional[str] = Field(default=None)
    username: Optional[str] = Field(default=None)
    decode_responses: bool = Field(default=True)
    db: int = Field(default=0)


__all__ = ['RedisConfig']