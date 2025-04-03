from sqlalchemy import Integer, DateTime, func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class IntIdPkMixin:
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

class CreatedAtPkMixin:
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class LastUpdatedAtPkMixin:
    last_updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())