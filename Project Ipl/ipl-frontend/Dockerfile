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

# Production stage - serve built app
FROM node:18-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Copy server.js
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
