from http import HTTPStatus
from typing import Annotated, Optional

from fastapi import APIRouter, Query, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    UserCreate,
    UserRead,
    UserBase,
    Token,
    TokenData,
    UserAuth
)
from .service import AuthService

from src.api.v1.services.crud import CRUDService
from src.api.v1.services.hash import HashService

from src.database import db_helper, User


router: APIRouter = APIRouter()

@router.post(
    path='/token',
    response_model=Token,
    status_code=HTTPStatus.OK
)
async def token_handler(
   session: Annotated[
        AsyncSession,
        Depends(db_helper.session_getter),
   ],
   token_form: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    email: str = token_form.username
    password: str = token_form.password

    auth: UserAuth = UserAuth(
        password=password,
        email=email
    )

    user: Optional[User] = await AuthService.authenticate_user(
        session=session,
        auth=auth
    )

    if user is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=[{'msg': 'Incorrect username (email) or password'}],
            headers={'WWW-Authenticate': 'Bearer'}
        )

    token: Token = AuthService().create_access_token(
        payload=TokenData(
            sub=auth.email
        ).model_dump()
    )
    return token

@router.post(
    path='/create-user',
    response_model=UserRead,
    status_code=HTTPStatus.CREATED
)
async def register_handler(
    session: Annotated[
        AsyncSession,
        Depends(db_helper.session_getter),
    ],
    user_create: Annotated[UserCreate, Query()]
):
    user: User = await CRUDService().get_user_by_email(
        session=session,
        email=user_create.email
    )

    if user:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT.value,
            detail=[{'msg': 'A user with this email already exists.'}]
        )

    user_create.hashed_password = str(HashService().hash(user_create.hashed_password).decode())

    user: User = await CRUDService().create_user(
        session=session,
        user=User(**user_create.model_dump())
    )

    token: Token = AuthService().create_access_token(
        payload=TokenData(
            sub=user.email
        ).model_dump()
    )

    return UserRead(
        user=UserBase.model_validate(user.__dict__),
        token=token
    )