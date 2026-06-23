import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(override=True)

api_key = os.getenv("DASHSCOPE_API_KEY")
base_url = os.getenv("QWEN_BASE_URL")

print("Key:", api_key[:15] if api_key else "NOT FOUND")
print("URL:", base_url)

client = OpenAI(api_key=api_key, base_url=base_url)

response = client.chat.completions.create(
    model="qwen-plus",
    messages=[{"role": "user", "content": "Say hello in one sentence"}]
)

print("Response:", response.choices[0].message.content)