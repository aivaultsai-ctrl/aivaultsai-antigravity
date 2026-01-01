# Infra Setup voor Slimme Telefoniste

De Async Queue-laag is volledig geconfigureerd op code-niveau, maar de infrastructuur (Redis + Postgres) moet nog gestart worden.

## Stappen om te starten:

1. **Start Docker containers**:
   ```bash
   docker-compose up -d
   ```
   *Dit start Postgres (5432) en Redis (6379).*

2. **Sync Database Schema**:
   In een nieuwe terminal, run:
   ```bash
   $env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/slimme_telefoniste"
   npx prisma migrate dev --name init_queue
   ```

3. **Valideer de verbinding**:
   ```bash
   npx tsx scripts/db-check.ts
   ```

## Belangrijke opmerking over Prisma 7:
Er is een omgevingsvariabele `DATABASE_URL` actief in je huidige sessie die wijst naar port 5432. De `.env` file bevat echter een `prisma+postgres` URL. Voor vloeibare execution raad ik aan om de sessie-variabele gelijk te trekken met je lokale Docker Postgres:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/slimme_telefoniste"
```

Zodra `scripts/db-check.ts` een 'Tenant count' logt, kunnen we de AI-extractie logica implementeren.
