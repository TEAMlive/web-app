from http import HTTPStatus
from jwt import InvalidTokenError
from typing import Optional, Annotated

from fastapi import Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import oauth2_scheme

from src.api.v1.services.crud import CRUDService
from src.api.v1.services.jwt import JWTService
from src.database import User, db_helper


class Service:
    @staticmethod
    async def get_current_user(
        session: Annotated[
            AsyncSession,
            Depends(db_helper.session_getter),
        ],
        token: Annotated[str, Depends(oauth2_scheme)]
    ) -> User:
        try:
            payload = JWTService().decode(
                token=token
            )

            email: str = payload.get('sub')

            if email is None:
                raise HTTPException(
                    status_code=HTTPStatus.UNAUTHORIZED.value,
                    detail=[{'msg': 'Could not validate credentials'}],
                    headers={'WWW-Authenticate': 'Bearer'}
                )

        except InvalidTokenError:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED.value,
                detail=[{'msg': 'Could not validate credentials'}],
                headers={'WWW-Authenticate': 'Bearer'}
            )

        user: Optional[User] = await CRUDService().get_user_by_email(
            session=session,
            email=email
        )

        if user is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED.value,
                detail=[{'msg': 'Could not validate credentials'}],
                headers={'WWW-Authenticate': 'Bearer'}
            )

        return user