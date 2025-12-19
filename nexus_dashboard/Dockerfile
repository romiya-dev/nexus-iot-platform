# Use Node.js (Alpine is super small and fast)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Run the dev server exposed to the network
CMD ["npm", "run", "dev", "--", "--host"]