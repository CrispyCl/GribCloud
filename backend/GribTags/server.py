import io
import os

import aiohttp
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
import uvicorn

from tags import Identificator

load_dotenv(override=False)

app = FastAPI()
tag_identifier = Identificator()

origins = [
    "http://localhost:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class File(BaseModel):
    url: str
    id: int
    access: str
    refresh: str


async def file_access(file_id, headers):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{django_server}/api/v1/files/", headers=headers) as response:
                if response.status == 200:
                    async with session.get(
                        f"{django_server}/api/v1/files/{file_id}",
                        headers=headers,
                    ) as response:
                        if response.status == 200:
                            return True
                        return False
                return False
        except Exception:
            return False


async def update_access_token(refresh):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{django_server}/api/v1/token/refresh/",
            data={"refresh": refresh},
        ) as response:
            if response.status == 200:
                data = await response.json()
                return data["access"]
            return None


async def read_image(url):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    image_bytes = await response.read()
                    return Image.open(io.BytesIO(image_bytes))
                return None
        except Exception:
            return None


@app.post("/auto_tags", status_code=status.HTTP_201_CREATED)
async def auto_tags(file: File):
    headers = {"Authorization": f"Bearer {file.access}"}
    if not await file_access(file.id, headers):
        file.access = await update_access_token(file.refresh)
        if not file.access:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh Token is invalid")
    image = await read_image(file.url)
    if not image:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to open url")

    tags = await tag_identifier.identify(image)

    if not await file_access(file.id, headers):
        file.access = await update_access_token(file.refresh)
        if not file.access:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh Token is invalid")
    async with aiohttp.ClientSession() as session:
        headers = {"Authorization": f"Bearer {file.access}"}
        for tag in tags.keys():
            await session.post(f"{django_server}/api/v1/files/{file.id}/tags/{tag}/", headers=headers)

    return tags


if __name__ == "__main__":
    host = os.getenv("FASTAPI_HOST", "127.0.0.1")
    port = int(os.getenv("FASTAPI_PORT", "8080"))
    django_server = "http://127.0.0.1:8000"
    uvicorn.run(app, host=host, port=port)
