FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
