from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import expression

from src.database import IntIdPkMixin, Base
from src.database.mixins import CreatedAtPkMixin, LastUpdatedAtPkMixin


class User(IntIdPkMixin,
           CreatedAtPkMixin,
           LastUpdatedAtPkMixin,
           Base):
    __tablename__ = 'users'

    activate: Mapped[bool] = mapped_column(
        Boolean,
        server_default=expression.true(),
        nullable=False
    )
    first_name: Mapped[str] = mapped_column(
        String(64),
        nullable=False
    )
    last_name: Mapped[str] = mapped_column(
        String(64),
        nullable=True
    )
    email: Mapped[str] = mapped_column(
        String(),
        nullable=False,
        unique=True
    )
    hashed_password: Mapped[str] = mapped_column(
        String(),
        nullable=False
    )