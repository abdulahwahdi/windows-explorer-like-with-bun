FROM oven/bun:1.0-debian

WORKDIR /app

# Install OpenSSL and curl (required by Prisma)
RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["sh", "-c", "sleep 5 && bunx prisma migrate deploy && bunx prisma db seed && bun run start"]