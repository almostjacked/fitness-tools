import pytest
from pydantic import BaseModel
from tools._registry import Tool, register, REGISTRY
from tools._models import Example

class _In(BaseModel):
    x: float

class _Out(BaseModel):
    y: float

def _compute(inp: _In) -> _Out:
    return _Out(y=inp.x * 2)

def _make_tool(tool_id="double"):
    return Tool(
        id=tool_id, name="Double", description="doubles x",
        category="test", tags=["t"], methods=["double"],
        input_model=_In, output_model=_Out, compute=_compute,
        examples=[Example(input={"x": 2}, output={"y": 4})],
    )

@pytest.fixture(autouse=True)
def isolate_registry():
    """Snapshot the global REGISTRY, clear it for the test, then restore it.

    Without this, clearing the shared global REGISTRY would wipe the real tools
    for the rest of the pytest session (imports are cached, so they won't
    re-register), breaking the api/contract tests depending on file order.
    """
    saved = dict(REGISTRY)
    REGISTRY.clear()
    yield
    REGISTRY.clear()
    REGISTRY.update(saved)

def test_register_adds_to_registry():
    t = _make_tool()
    register(t)
    assert REGISTRY["double"] is t

def test_duplicate_id_rejected():
    register(_make_tool())
    with pytest.raises(ValueError):
        register(_make_tool())
