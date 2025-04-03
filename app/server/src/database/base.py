from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

from src.config import app


class Base(DeclarativeBase):
    __abstract__ = True

    metadata = MetaData(
        naming_convention=app.database.naming_convention
    )