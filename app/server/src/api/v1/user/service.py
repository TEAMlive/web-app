from http import HTTPStatus

from fastapi import HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import UserPasswordUpdate

from src.api.v1.services import HashService, CRUDService
from src.database import User


class UserService:
    @staticmethod
    async def change_password(
        session: AsyncSession,
        password_update: UserPasswordUpdate,
        user: User
    ) -> User:
        if not HashService().validate(
            password=password_update.current_password,
            hashed_password=user.hashed_password
        ):
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN.value,
                detail=[{'msg': 'The password is incorrect'}]
            )

        if password_update.current_password == password_update.new_password:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST.value,
                detail=[{'msg': 'The password cannot match the previous one'}]
            )

        await CRUDService().change_user_password(
            session=session,
            user=user,
            password=password_update.new_password
        )

        return user