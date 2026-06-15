# Stage 1: Build Frontend
FROM docker.m.daocloud.io/library/node:20-slim AS frontend-builder
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
WORKDIR /app/frontend
COPY repo/frontend/package*.json ./
RUN npm ci
COPY repo/frontend/ ./
RUN npm run build

# Stage 2: Build Backend and Final Image
FROM docker.m.daocloud.io/library/node:20-slim
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
WORKDIR /app

# Use domestic Debian mirrors and install dependencies for SQLite3.
# Use HTTP here because node:20-slim may not include CA certificates before apt installs them.
RUN sed -i \
      -e 's|http://deb.debian.org/debian|http://mirrors.tuna.tsinghua.edu.cn/debian|g' \
      -e 's|http://security.debian.org/debian-security|http://mirrors.tuna.tsinghua.edu.cn/debian-security|g' \
      -e 's|http://deb.debian.org/debian-security|http://mirrors.tuna.tsinghua.edu.cn/debian-security|g' \
      -e 's|https://deb.debian.org/debian|http://mirrors.tuna.tsinghua.edu.cn/debian|g' \
      -e 's|https://security.debian.org/debian-security|http://mirrors.tuna.tsinghua.edu.cn/debian-security|g' \
      /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git lsof python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies first to keep npm install cacheable.
COPY repo/backend/package*.json ./backend/
RUN cd backend && npm ci

# Copy every file from repo into /app.
COPY repo/ ./

# Copy frontend build results
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create data directory for SQLite
RUN mkdir -p ./data

# Environment variables
ENV PORT=3207
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV SSH_PORT=22

EXPOSE 3207

# Run seed and then start server
# Note: server.js is in backend/src/server.js
# We need to run it from backend directory or adjust paths
WORKDIR /app/backend
CMD ["sh", "-c", "node src/seed.js && node src/server.js"]


# ========== SSH plugin (pluggable, for Cursor/Trae vibe coding) ==========
# Drop-in block: copy the same `ssh_plugin/` folder next to this Dockerfile
# and paste this block at the end of any business Dockerfile. Nothing else
# in the business logic needs to change.
#
# Optional customisation (add BEFORE this block if needed):
#   ENV SSH_PASSWORD=mysecret           # change root password (default: password)
#   ENV SSH_PORT=2222                   # change sshd port     (default: 22)
#   ENV ORIG_ENTRYPOINT=/docker-entrypoint.sh   # chain base image's ENTRYPOINT
#                                                # (e.g. postgres, mysql, jupyter)
#
# NOTE: this block runs as root (required to install sshd). If the base image
#       uses a non-root USER, restore it at the very end, e.g. `USER node`.
USER root
COPY ssh_plugin/ /opt/ssh_plugin/
RUN chmod +x /opt/ssh_plugin/*.sh && /opt/ssh_plugin/install_ssh.sh
EXPOSE 22
ENTRYPOINT ["/opt/ssh_plugin/entrypoint.sh"]
# USER <original-user>   # uncomment & set if the base image requires non-root
# ========== end SSH plugin ==========
