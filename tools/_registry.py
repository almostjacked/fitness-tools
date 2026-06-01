from dataclasses import dataclass
from typing import Callable
from pydantic import BaseModel
from tools._models import Example


@dataclass
class Tool:
    id: str
    name: str
    description: str
    category: str
    tags: list[str]
    methods: list[str]
    input_model: type[BaseModel]
    output_model: type[BaseModel]
    compute: Callable[[BaseModel], BaseModel]
    examples: list[Example]


REGISTRY: dict[str, Tool] = {}


def register(tool: Tool) -> Tool:
    if tool.id in REGISTRY:
        raise ValueError(f"duplicate tool id: {tool.id}")
    REGISTRY[tool.id] = tool
    return tool
