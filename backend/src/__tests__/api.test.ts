import { describe, it, expect } from "vitest";
import { app } from "../app.js";
import http from "http";

describe("API Routing & Validation", () => {
  let server: http.Server;
  let baseUrl: string;

  it("serves root informational endpoint", async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr: any = server.address();
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });

    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe("Quick News API");
    expect(json.tagline).toBe("Stay informed. Stay ahead.");

    server.close();
  });

  it("validates invalid query parameters on /api/articles", async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr: any = server.address();
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });

    // limit exceeds maximum 50
    const res = await fetch(`${baseUrl}/api/articles?limit=999`);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid query parameters");

    server.close();
  });
});
