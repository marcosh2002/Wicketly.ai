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

# Use nginx to serve the built app
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

# Use sh script to substitute PORT variable
CMD ["sh", "-c", "sed -i 's/3000/'${PORT:-3000}'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
