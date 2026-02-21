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

# Install Express for serving the SPA
RUN npm install express

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Create simple Express server
RUN cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Expose port
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
