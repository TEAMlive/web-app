from datetime import timedelta, datetime, timezone
from typing import Optional, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import Token, UserAuth

from src.api.v1.services.crud import CRUDService
from src.api.v1.services.hash import HashService
from src.api.v1.services.jwt import JWTService

from src.config import app
from src.database import User


class AuthService:
    @staticmethod
    async def authenticate_user(
        session: AsyncSession,
        auth: UserAuth
    ) -> Optional[User]:
        user: Optional[User] = await CRUDService().get_user_by_email(
            session=session,
            email=auth.email
        )

        if not user:
            return None

        if not HashService().validate(
            password=auth.password,
            hashed_password=user.hashed_password
        ):
            return None

        return user

    @staticmethod
    def create_access_token(
        payload: Dict,
        expires_delta: timedelta = app.jwt.access_token_ttl
    ) -> Token:
        expire = datetime.now(timezone.utc) + expires_delta

        payload.update({'exp': expire})

        access_token: str = JWTService().encode(
            payload=payload
        )

        return Token(
            access_token=access_token,
            token_type='bearer'
        )