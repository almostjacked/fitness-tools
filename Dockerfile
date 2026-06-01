FROM python:3.12-slim

WORKDIR /app

# Install from pyproject.toml (single source of truth for deps) — no uv needed in the
# image; hatchling builds the package. Source must be present for the build.
COPY pyproject.toml README.md LICENSE ./
COPY fitness_core ./fitness_core
COPY tools ./tools
COPY api ./api
RUN pip install --no-cache-dir .

# Run as a non-root user
RUN adduser --system --no-create-home appuser
USER appuser

ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port ${PORT}"]
