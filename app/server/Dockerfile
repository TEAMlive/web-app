FROM python:3.13.2

ENV POETRY_VERSION=2.1.1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install -U pip setuptools \
    && pip install poetry==${POETRY_VERSION}

COPY pyproject.toml .

RUN poetry config virtualenvs.in-project true
RUN poetry install

COPY . .