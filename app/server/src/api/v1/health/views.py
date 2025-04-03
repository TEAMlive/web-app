from http import HTTPStatus

from fastapi import APIRouter

from .schemas import Health


router: APIRouter = APIRouter()

@router.get(
    path='/health',
    response_model=Health,
    status_code=HTTPStatus.OK
)
def health_handler() -> Health:
    return Health(
        success=True,
    )