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

# Production stage - serve with Express server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Copy server.js
COPY server.js ./

# Expose port
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
