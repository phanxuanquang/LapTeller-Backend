import asyncio
from sydney import SydneyClient

question = "hello"

async def main():
    async with SydneyClient() as sydney:
        response = await sydney.ask(question)
        print(response)

if __name__ == "__main__":
    asyncio.run(main())