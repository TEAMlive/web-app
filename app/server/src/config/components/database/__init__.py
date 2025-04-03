from typing import Dict

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings


class DatabaseConfig(BaseSettings):
    database: str = Field(default='db')
    user: str = Field(default='user')
    password: SecretStr = Field(default='password')
    host: str = Field(default='postgres')
    host_alembic: str = Field(default='localhost')
    port: int = Field(default=5432)

    echo: bool = Field(default=False)
    echo_pool: bool = Field(default=False)
    pool_size: int = Field(default=5)
    max_overflow: int = Field(default=10)

    naming_convention: Dict[str, str] = Field(
        default= {
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_N_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s"
        }
    )

__all__ = ['DatabaseConfig']