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