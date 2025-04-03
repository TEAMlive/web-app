from pydantic import BaseModel

from typing import Optional

from fastapi.security import OAuth2PasswordBearer


oauth2_scheme: OAuth2PasswordBearer = OAuth2PasswordBearer(
    tokenUrl='api/v1/auth/token'
)

class UserBase(BaseModel):
    id: int
    activate: bool
    first_name: str
    last_name: Optional[str]
    email: str