from pydantic import Field
from pydantic_settings import BaseSettings


class RedocConfig(BaseSettings):
    title: str = Field(default='ReDoc')
    prefix: str = Field(default='/redoc')