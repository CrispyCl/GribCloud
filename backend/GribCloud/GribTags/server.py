import os

from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

load_dotenv(override=False)

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    host = os.getenv("FASTAPI_HOST", "127.0.0.1")
    port = int(os.getenv("FASTAPI_PORT", "8080"))
    uvicorn.run(app, host=host, port=port)
