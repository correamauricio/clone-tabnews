import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const defaultMigrationOptions = {
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });
    response.status(200).json(pendingMigrations);
    await dbClient.end();
  }

  if (request.method === "POST") {
    const dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient: dbClient,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    }

    response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
