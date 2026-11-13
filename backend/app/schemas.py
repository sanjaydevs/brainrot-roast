from typing import Literal
from pydantic import BaseModel, Field


class AppUsage(BaseModel):
    name:str = Field(description="App name visible in the screenshot")
    duration_minutes:int = Field(ge=0,description="Usage duration converted to minutes")
    
    
class ScreenTimeData(BaseModel):
    platform: Literal["ios", "android", "unknown"]
    total_screen_time_minutes: int | None = Field(
        description="Reported total screen time in minutes, or null if unreadable"
    )
    apps: list[AppUsage]
    warnings: list[str] = Field(
        description="Missing, unreadable, or ambiguous information"
    )
    
class RoastReport(BaseModel):
    headline: str = Field(description="A short, funny roast headline")
    roast: list[str] = Field(
        description="Two or three personalized roast paragraphs"
    )
    insights: list[str] = Field(
        description="Three specific observations based on the screen-time data"
    )