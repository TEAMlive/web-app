from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings


class CORSConfig(BaseSettings):
    origins: List[str] = Field(default=['*'])
    credentials: bool = Field(default=True)
    methods: List[str] = Field(default=['*'])
    headers: List[str] = Field(default=['*'])

__all__ = ['CORSConfig']