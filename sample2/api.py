import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

# CORS設定（フロントエンドからアクセス可能にする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では制限してください
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL"),
    api_key=os.getenv("OPENAI_API_KEY"),
)


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    response = client.chat.completions.create(
        model="x-ai/grok-4-fast:free",
        messages=[
            {"role": "system", "content": "あなたは親切なアシスタントです。"},
            {"role": "user", "content": user_input},
        ],
    )

    return {"reply": response.choices[0].message.content}
