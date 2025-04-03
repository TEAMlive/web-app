from typing import Optional, Annotated

from annotated_types import MinLen, MaxLen
from pydantic import BaseModel, Field, EmailStr

from src.api.v1.schemas import UserBase


class TokenData(BaseModel):
    sub: Optional[EmailStr]

class Token(BaseModel):
    access_token: str
    token_type: str

class UserAuth(BaseModel):
    password: str
    email: str

class UserCreate(BaseModel):
    first_name: Annotated[str, MinLen(3), MaxLen(64)]
    last_name: Optional[Annotated[str, MinLen(3), MaxLen(64)]] = Field(default=None)
    hashed_password: Annotated[str, MinLen(5)]
    email: EmailStr

class UserRead(BaseModel):
    user: UserBase
    token: Token