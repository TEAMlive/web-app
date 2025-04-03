from typing import Annotated, Optional
from annotated_types import MinLen, MaxLen
from pydantic import BaseModel


class UserFirstNameUpdate(BaseModel):
    first_name: Annotated[str, MinLen(3), MaxLen(64)]

class UserLastNameUpdate(BaseModel):
    last_name: Optional[Annotated[str, MinLen(3), MaxLen(64)]]

class UserPasswordUpdate(BaseModel):
    current_password: Annotated[str, MinLen(5)]
    new_password: Annotated[str, MinLen(5)]