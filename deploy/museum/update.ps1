Set-Location $PSScriptRoot
docker compose pull
docker compose up -d --wait
docker compose ps