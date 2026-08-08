from pydantic import BaseModel
from typing import List, Optional

class ScheduleTiming(BaseModel):
    day: str
    start: Optional[str] = None
    end: Optional[str] = None
    isWorking: bool = True

class ScheduleUpdateRequest(BaseModel):
    timings: List[ScheduleTiming]
