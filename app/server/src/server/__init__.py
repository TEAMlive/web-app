from contextlib import asynccontextmanager
from typing import AsyncGenerator

from starlette.staticfiles import StaticFiles

from src.config import app
from fastapi import FastAPI
from starlette.responses import HTMLResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import (get_swagger_ui_html,
                                  get_swagger_ui_oauth2_redirect_html,
                                  get_redoc_html)

from src.database import db_helper


class Server:
    def __init__(self) -> None:
        self.application: FastAPI = FastAPI(
            debug=app.debug,
            title=app.title,
            description=app.description,
            default_response_class=JSONResponse,
            version=app.version,
            docs_url=None,
            redoc_url=None
        )

        self._init_router()
        self._init_middleware()
        self._init_lifespan()

        if app.debug:
            self._init_swagger()

    def __call__(self) -> FastAPI:
        return self.application

    def _init_router(self) -> None:
        from src import router

        self.application.include_router(router)

    def _init_middleware(self) -> None:
        self.application.add_middleware(
            CORSMiddleware,
            allow_origins=app.cors.origins,
            allow_credentials=app.cors.credentials,
            allow_methods=app.cors.methods,
            allow_headers=app.cors.headers
        )

    def _init_lifespan(self) -> None:
        @asynccontextmanager
        async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
            yield
            await db_helper.dispose()

        self.application.lifespan = lifespan

    def _init_swagger(self) -> None:
        self.application.mount(
            path=app.swagger.static_path,
            app=StaticFiles(
                directory=app.swagger.mount_path
            ),
            name='static'
        )

        @self.application.get(
            path=app.swagger.docs.prefix,
            include_in_schema=False
        )
        async def custom_swagger_ui_html_handler() -> HTMLResponse:
            return get_swagger_ui_html(
                openapi_url=self.application.openapi_url,
                title=f'{app.title} - {app.swagger.docs.title}',
                oauth2_redirect_url=self.application.swagger_ui_oauth2_redirect_url,
                swagger_js_url=f'{app.swagger.static_path}/swagger-ui-bundle.js',
                swagger_css_url=f'{app.swagger.static_path}/swagger-ui.css',
            )

        @self.application.get(self.application.swagger_ui_oauth2_redirect_url,
                 include_in_schema=False)
        async def swagger_ui_redirect() -> HTMLResponse:
            return get_swagger_ui_oauth2_redirect_html()

        @self.application.get(
            path=app.swagger.redoc.prefix,
            include_in_schema=False
        )
        async def redoc_html() -> HTMLResponse:
            return get_redoc_html(
                openapi_url=self.application.openapi_url,
                title=f'{app.title} - {app.swagger.redoc.title}',
                redoc_js_url=f'{app.swagger.static_path}/redoc.standalone.js',
            )

server: Server = Server()

__all__ = ['server']