from fastapi import APIRouter

from .health import router as health_router
from .auth import router as auth_router
from .user import router as user_router


router: APIRouter = APIRouter(
    prefix='/v1',
)

router.include_router(
    router=health_router,
    tags=['health']
)
router.include_router(
    router=auth_router,
    prefix='/auth',
    tags=['auth']
)
router.include_router(
    router=user_router,
    prefix='/user',
    tags=['user']
)

__all__ = ['router']