from pydantic import Field
from pydantic_settings import BaseSettings

from src.config.constants import ENV_FILE_PATH

from src.config.components.jwt import JWTConfig
from src.config.components.cors import CORSConfig
from src.config.components.redis import RedisConfig
from src.config.components.swagger import SwaggerConfig
from src.config.components.database import DatabaseConfig


class ApplicationConfig(BaseSettings):
    debug: bool = Field(default=False)
    title: str = Field(default='fastapi-app')
    description: str = Field(default='fastapi-app')
    version: str = Field(default='1.0.0')

    host: str = Field(default='0.0.0.0')
    port: int = Field(default=8000)

    jwt: JWTConfig = JWTConfig()
    cors: CORSConfig = CORSConfig()
    redis: RedisConfig = RedisConfig()
    swagger: SwaggerConfig = SwaggerConfig()
    database: DatabaseConfig = DatabaseConfig()

    class Config:
        env_file = ENV_FILE_PATH
        env_file_encoding = 'utf-8'
        case_sensitive = False
        env_nested_delimiter = '__'
        env_prefix = 'CONFIG__'