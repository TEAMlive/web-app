from pydantic import BaseModel


class Health(BaseModel):
    success: bool