from pydantic import BaseModel


class MethodResult(BaseModel):
    method: str
    value: float
    unit: str
    detail: dict | None = None


class SkippedMethod(BaseModel):
    method: str
    reason: str


class Consensus(BaseModel):
    mean: float
    median: float
    min: float
    max: float
    n: int


class Example(BaseModel):
    input: dict
    output: dict
