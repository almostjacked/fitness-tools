# Build core + api from the workspace, then run the api on Cloud Run.
FROM node:22-slim AS build
WORKDIR /app
# corepack resolves pnpm 11 in-image, which enforces supply-chain guardrails that
# are absent on the host: a minimumReleaseAge gate that rejects freshly published
# deps (our committed lockfile is already vetted), a strict ignored-builds error
# for esbuild (a dev-only dep, pruned by `deploy --prod`), and an auto re-install
# verify before `pnpm run` that would re-trigger the age gate. These env vars
# relax those policies for every pnpm invocation in this stage; the architecture
# (frozen install -> build -> deploy --prod) is unchanged.
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV PNPM_CONFIG_STRICT_DEP_BUILDS=false
ENV PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/core/package.json packages/core/package.json
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile
COPY packages/core packages/core
COPY apps/api apps/api
RUN pnpm -C packages/core build && pnpm -C apps/api build
# --legacy: pnpm 10+ otherwise refuses to deploy a workspace that is not set up
# with inject-workspace-packages; --legacy copies the linked workspace dep instead.
RUN pnpm --filter @fitness-tools/api deploy --prod --legacy /out

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /out /app
USER node
EXPOSE 8080
CMD ["node", "dist/server.js"]
