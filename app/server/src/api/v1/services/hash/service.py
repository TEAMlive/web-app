import bcrypt


class HashService:
    @staticmethod
    def hash(
        password: str,
    ) -> bytes:

        salt: bytes = bcrypt.gensalt()
        pwd_bytes: bytes = password.encode()

        return bcrypt.hashpw(pwd_bytes, salt)

    @staticmethod
    def validate(
        password: str,
        hashed_password: bytes | str
    ) -> bool:
        password: bytes = password.encode('utf-8')

        if isinstance(hashed_password, str):
            hashed_password: bytes = hashed_password.encode('utf-8')

        return bcrypt.checkpw(
            password=password,
            hashed_password=hashed_password,
        )