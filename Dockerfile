FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite & esbuild)
RUN npm install

# Copy all source files
COPY . .

# Build frontend and server
RUN npm run build

# --- Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create uploads directory for persistent storage
RUN mkdir -p /app/public/uploads

# Expose HTTP port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]
