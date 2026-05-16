# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY repo/frontend/package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
COPY repo/frontend/ ./
RUN npm run build

# Stage 2: Build Backend and Final Image
FROM node:20-slim
WORKDIR /app

# Install dependencies for SQLite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies
COPY repo/backend/package*.json ./backend/
RUN cd backend && npm config set registry https://registry.npmmirror.com && npm ci

# Copy backend source
COPY repo/backend/ ./backend/

# Copy frontend build results
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create data directory for SQLite
RUN mkdir -p ./data

# Environment variables
ENV PORT=3207
ENV NODE_ENV=production

EXPOSE 3207

# Run seed and then start server
# Note: server.js is in backend/src/server.js
# We need to run it from backend directory or adjust paths
WORKDIR /app/backend
CMD ["sh", "-c", "node src/seed.js && node src/server.js"]
