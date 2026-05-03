test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdatedAt);

  const databaseVersion = responseBody.dependencies.database.version;
  expect(databaseVersion).toBeGreaterThanOrEqual(16);

  const databaseMaxConnections =
    responseBody.dependencies.database.max_connections;
  expect(databaseMaxConnections).toBeGreaterThan(0);
  expect(databaseMaxConnections).toEqual(expect.any(Number));
  expect(Number.isInteger(databaseMaxConnections)).toBe(true);

  const databaseOpenedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(databaseOpenedConnections).toBe(1);
});
