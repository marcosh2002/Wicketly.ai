# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage - serve static files
FROM node:18-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Expose port (Railway will assign PORT via environment variable)
EXPOSE 3000

# Start server - listen on PORT env var (set by Railway) or default to 3000
CMD ["sh", "-c", "serve -s build -l ${PORT:-3000}"]
