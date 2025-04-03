from http import HTTPStatus

from fastapi import APIRouter

from .v1 import router as v1_router
from .schemas import ErrorResponse, ErrorMessage


router: APIRouter = APIRouter(
    prefix='/api',
    responses={
        HTTPStatus.BAD_REQUEST.value: {"model": ErrorResponse},
        HTTPStatus.UNAUTHORIZED.value: {"model": ErrorResponse},
        HTTPStatus.FORBIDDEN.value: {"model": ErrorResponse},
        HTTPStatus.NOT_FOUND.value: {"model": ErrorResponse},
        HTTPStatus.CONFLICT.value: {"model": ErrorResponse},
        HTTPStatus.INTERNAL_SERVER_ERROR.value: {"model": ErrorResponse},
    },
)

router.include_router(
    router=v1_router
)

__all__ = ['router']