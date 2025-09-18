from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import asyncio
from datetime import datetime
import logging
import google.generativeai as genai
from dotenv import load_dotenv
import base64
import io
import json
import re
from PIL import Image as PILImage


load_dotenv()

# configure logging
# enables us add logging messages throughout our code

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#initialize gemini ai
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))


app = FastAPI(
    title='Flood Detection API',
    description='Flood Risk Assessment using Gemini AI',
    version= "1.0.0"
)


#cors middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# pydantic models

class CoordinateRequest(BaseModel):
    latitude: float
    longitude: float


class AnalysisResponse(BaseModel):
    success: bool
    risk_level: str
    description: str
    recommendations: list[str]
    elevation: float
    distance_from_water: float
    message: str




@app.get('/')
async def root():

    return {
        "message": "Flood detection api is running",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=8001, reload=True,
                log_level="info")