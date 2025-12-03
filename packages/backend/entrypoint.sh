set -e

echo "🔄 Waiting for database..."
sleep 5

echo "📦 Running Prisma migrations..."
bunx prisma migrate deploy

echo "🌱 Seeding database..."
if bunx prisma db seed; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️ Seeding failed or already seeded, continuing..."
fi

echo "🚀 Starting server..."
exec bun run start