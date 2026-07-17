# =============================================================================
# Stage 1 — Builder
# Installs all dependencies (including devDeps) and compiles TypeScript.
# =============================================================================
FROM node:20-alpine AS builder

# Install build essentials needed by native addons (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy manifests first for layer-cache efficiency
COPY package.json package-lock.json ./

# Install ALL deps (devDependencies needed for tsc)
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → dist/
RUN npm run build


# =============================================================================
# Stage 2 — Production runtime
# Only production dependencies + compiled JS. No source, no devDeps, no secrets.
# =============================================================================
FROM node:20-alpine AS production

# Security: run as non-root
RUN addgroup -S plos && adduser -S plos -G plos

WORKDIR /app

# Copy manifests
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Apply correct ownership
RUN chown -R plos:plos /app

USER plos

# The port the Express app listens on (overridable via ENV)
EXPOSE 3000

# Healthcheck — hits the lightweight /health route
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the compiled server
CMD ["node", "dist/server.js"]
