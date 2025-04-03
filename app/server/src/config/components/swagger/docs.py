from pydantic import Field
from pydantic_settings import BaseSettings


class DocsConfig(BaseSettings):
    title: str = Field(default='Swagger UI')
    prefix: str = Field(default='/docs')