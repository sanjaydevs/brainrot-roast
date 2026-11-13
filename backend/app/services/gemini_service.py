import os

from google import genai
from google.genai import types

from app.schemas import ScreenTimeData


client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def extract_screen_time(
    image_bytes: bytes,
    mime_type: str,
) -> ScreenTimeData:

    prompt = """
    Analyze this screenshot of a phone's screen-time report.

    Extract:
    - Whether it is an iOS or Android report
    - The reported total screen time
    - App names and their usage durations

    Rules:
    - Only extract information visible in the screenshot.
    - Convert all durations to whole minutes.
    - Do not invent missing values.
    - If the total screen time is unreadable, return null.
    - If information is ambiguous, explain it in warnings.
    - Do not calculate or invent a brain rot score.
    - Do not add apps that are not visible.
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ScreenTimeData,
            temperature=0,
        ),
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    return ScreenTimeData.model_validate_json(response.text)