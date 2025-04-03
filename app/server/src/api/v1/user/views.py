from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.v1.services import CRUDService
from src.api.v1.service import Service
from src.api.v1.schemas import UserBase
from src.database import User, db_helper

from .schemas import UserPasswordUpdate, UserFirstNameUpdate, UserLastNameUpdate
from .service import UserService


router: APIRouter = APIRouter()

@router.post(
    path='/change-password',
    status_code=HTTPStatus.OK,
    response_model=UserBase
)
async def change_password_handler(
    current_user: Annotated[User, Depends(Service().get_current_user)],
    session: Annotated[
        AsyncSession,
        Depends(db_helper.session_getter),
    ],
    password_update: Annotated[UserPasswordUpdate, Query()]
) -> User:
    user: User = await UserService().change_password(
        session=session,
        password_update=password_update,
        user=current_user
    )

    return user

@router.post(
    path='/change-first-name',
    status_code=HTTPStatus.OK,
    response_model=UserBase
)
async def change_first_name_handler(
    current_user: Annotated[User, Depends(Service().get_current_user)],
    session: Annotated[
        AsyncSession,
        Depends(db_helper.session_getter),
    ],
    first_name_update: Annotated[UserFirstNameUpdate, Query()]
) -> User:
    user: User = await CRUDService().change_first_name(
        session=session,
        user=current_user,
        first_name=first_name_update.first_name,
    )

    return user

@router.post(
    path='/change-last-name',
    status_code=HTTPStatus.OK,
    response_model=UserBase
)
async def change_first_name_handler(
    current_user: Annotated[User, Depends(Service().get_current_user)],
    session: Annotated[
        AsyncSession,
        Depends(db_helper.session_getter),
    ],
    last_name_update: Annotated[UserLastNameUpdate, Query()]
) -> User:
    user: User = await CRUDService().change_last_name(
        session=session,
        user=current_user,
        first_name=last_name_update.last_name,
    )

    return user