from fastapi import FastAPI
from .server import server


app: FastAPI = server