from pydantic import BaseModel


class ScheduleTiming(BaseModel):
    day: str
    start: str | None = None
    end: str | None = None
    isWorking: bool = True


class ScheduleUpdateRequest(BaseModel):
    timings: list[ScheduleTiming]
