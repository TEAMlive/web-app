from http import HTTPStatus

from fastapi import APIRouter

from .api import v1_router as v1
from .schemas import ErrorResponse


router: APIRouter = APIRouter(
    responses={
        HTTPStatus.BAD_REQUEST.value: {"model": ErrorResponse},
        HTTPStatus.UNAUTHORIZED.value: {"model": ErrorResponse},
        HTTPStatus.FORBIDDEN.value: {"model": ErrorResponse},
        HTTPStatus.NOT_FOUND.value: {"model": ErrorResponse},
        HTTPStatus.CONFLICT.value: {"model": ErrorResponse},
        HTTPStatus.INTERNAL_SERVER_ERROR.value: {"model": ErrorResponse},
    },
)
router.include_router(v1)

__all__ = ['router']