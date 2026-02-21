# Build stage for frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY src ./src
COPY public ./public

# Build React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend from builder
COPY --from=frontend-builder /app/build ./build

# Copy server.js
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
