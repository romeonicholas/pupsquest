Create .env with DATABASE_URL=postgres://pupsquest:pupsquest@localhost:5432/pupsquest

npm install
docker compose up -d
npm run db:reset
npm run dev
