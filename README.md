Create .env with:

DATABASE_URL=postgres://pupsquest:pupsquest@localhost:5432/pupsquest

APP_MODE=museum (or online for the phone version)

Run locally:

npm install

docker compose up -d

npm run db:reset

npm run dev

Run tests:

npm test (vitest for the api)

npm run test:browser (playwright for visual/e2e stuff)

New museum process:

Only need deploy\museum folder now

Download Docker and set it to start automatically

update.ps1 (first time and when update is necessary)
