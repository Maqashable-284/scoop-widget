# ============================================
# Scoop AI Widget - Static React App
# Node.js build + Nginx serve
# ============================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run uses 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
