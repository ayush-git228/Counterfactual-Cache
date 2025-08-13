import asyncio
import sys
import uvicorn

if sys.platform == "win32":
    # Required for asyncio subprocess support used by Playwright on Windows
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)