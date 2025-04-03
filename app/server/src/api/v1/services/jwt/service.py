import jwt
from typing import Dict, Any

from src.config import app


class JWTService:
    @staticmethod
    def encode(
        payload: Dict,
        private_key: str = app.jwt.private_key.read_text(),
        algorithm: str = app.jwt.algorithm
    ) -> str:
        encoded: str = jwt.encode(
            payload=payload,
            key=private_key,
            algorithm=algorithm,
        )

        return encoded

    @staticmethod
    def decode(
        token: str,
        public_key: str = app.jwt.public_key.read_text(),
        algorithm: str = app.jwt.algorithm
    ):
        decoded: Any = jwt.decode(
            jwt=token,
            key=public_key,
            algorithms=[algorithm]
        )

        return decoded