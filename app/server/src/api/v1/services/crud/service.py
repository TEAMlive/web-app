from typing import Optional

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.v1.auth.schemas import UserCreate
from src.api.v1.services import HashService
from src.database import User


class CRUDService:
    @staticmethod
    async def get_user_by_email(
        session: AsyncSession,
        email: str
    ) -> Optional[User]:
        result = await session.execute(Select(User).where(User.email == email))

        return result.scalar_one_or_none()

    @staticmethod
    async def create_user(
        session: AsyncSession,
        user: User
    ) -> User:
        session.add(user)
        await session.commit()

        return user

    @staticmethod
    async def change_first_name(
        session: AsyncSession,
        user: User,
        first_name: str
    ):
        user.first_name = first_name

        await session.commit()

        return user

    @staticmethod
    async def change_last_name(
        session: AsyncSession,
        user: User,
        last_name: Optional[str]
    ):
        user.last_name = last_name

        await session.commit()

        return user

    @staticmethod
    async def change_user_password(
        session: AsyncSession,
        user: User,
        password: str
    ) -> User:
        user.hashed_password = str(HashService().hash(
            password=password
        ).decode())

        await session.commit()

        return user