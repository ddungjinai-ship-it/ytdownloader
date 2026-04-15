from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import yt_dlp
import os
import uuid
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel's temp directory
DOWNLOAD_DIR = "/tmp/downloads"
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.get("/api/info")
async def get_info(url: str):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "uploader": info.get('uploader'),
                "formats": [
                    {
                        "format_id": f.get('format_id'),
                        "ext": f.get('ext'),
                        "resolution": f.get('resolution'),
                        "filesize": f.get('filesize'),
                    } for f in info.get('formats', []) if f.get('ext') == 'mp4'
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/download")
async def download_video(url: str):
    request_id = str(uuid.uuid4())
    filename = f"{request_id}.mp4"
    filepath = os.path.join(DOWNLOAD_DIR, filename)

    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': filepath,
        'quiet': True,
    }

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: yt_dlp.YoutubeDL(ydl_opts).download([url]))
        
        if os.path.exists(filepath):
            return FileResponse(
                filepath, 
                media_type='video/mp4', 
                filename=f"video_{request_id}.mp4"
            )
        else:
            raise HTTPException(status_code=500, detail="Download failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
