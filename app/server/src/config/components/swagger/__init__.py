from pydantic import Field
from pydantic_settings import BaseSettings

from .docs import DocsConfig
from .redoc import RedocConfig


class SwaggerConfig(BaseSettings):
    static_path: str = Field(default='/src/swagger/static')
    mount_path: str = Field(default='src/swagger/static')
    name: str = Field(default='static')

    docs: DocsConfig = DocsConfig()
    redoc: RedocConfig = RedocConfig()

__all__ = ['SwaggerConfig']