import io
import os

import aiohttp
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from PIL import Image
from pydantic import BaseModel
import uvicorn

from tags import Identificator

load_dotenv(override=False)

app = FastAPI()
tag_identifier = Identificator()


class File(BaseModel):
    url: str
    id: int
    access: str
    refresh: str


async def file_access(file_id, headers):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get("http://127.0.0.1:8000/api/v1/files/", headers=headers) as response:
                if response.status == 200:
                    async with session.get(
                        f"http://127.0.0.1:8000/api/v1/files/{file_id}",
                        headers=headers,
                    ) as response:
                        if response.status == 200:
                            return True
                        return False
                return False
        except Exception:
            return False


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
async def upload_image(file: File):
    headers = {"Authorization": f"Bearer {file.access}"}
    if not await file_access(file.id, headers):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://127.0.0.1:8000/api/v1/token/refresh/",
                data={"refresh": file.refresh},
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    file.access = data["access"]
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh Token is invalid")
    image = await read_image(file.url)
    if not image:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to open url")

    tags = tag_identifier.identify(image)

    if not await file_access(file.id, headers):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://127.0.0.1:8000/api/v1/token/refresh/",
                data={"refresh": file.refresh},
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    file.access = data["access"]
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh Token is invalid")
    async with aiohttp.ClientSession() as session:
        headers = {"Authorization": f"Bearer {file.access}"}
        try:
            for tag in tags.keys():
                await session.post(f"http://127.0.0.1:8000/api/v1/files/{file.id}/tags/{tag}/", headers=headers)
        except Exception:
            pass
    return tags


if __name__ == "__main__":
    host = os.getenv("FASTAPI_HOST", "127.0.0.1")
    port = int(os.getenv("FASTAPI_PORT", "8080"))
    uvicorn.run(app, host=host, port=port)
