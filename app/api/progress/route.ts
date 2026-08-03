import { getChatGPTUser } from "../../chatgpt-auth";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS quiz_progress (
  user_email TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

async function authenticatedEmail() {
  const user = await getChatGPTUser();
  return user?.email.toLocaleLowerCase() ?? null;
}

async function database() {
  const { env } = await import("cloudflare:workers");
  return env.DB;
}

async function ensureTable(db: D1Database) {
  await db.prepare(CREATE_TABLE).run();
}

export async function GET() {
  const email = await authenticatedEmail();
  if (!email) return Response.json({ signedIn: false }, { status: 401 });
  const db = await database();
  await ensureTable(db);
  const row = await db.prepare("SELECT payload, updated_at AS updatedAt FROM quiz_progress WHERE user_email = ?")
    .bind(email).first<{ payload: string; updatedAt: string }>();
  return Response.json({ signedIn: true, progress: row ? JSON.parse(row.payload) : null, updatedAt: row?.updatedAt ?? null });
}

export async function PUT(request: Request) {
  const email = await authenticatedEmail();
  if (!email) return Response.json({ signedIn: false }, { status: 401 });
  const body = await request.json() as { history?: unknown; filters?: unknown };
  if (!Array.isArray(body.history) || !body.filters || typeof body.filters !== "object") {
    return Response.json({ error: "Invalid progress data" }, { status: 400 });
  }
  const db = await database();
  await ensureTable(db);
  const updatedAt = new Date().toISOString();
  await db.prepare(`INSERT INTO quiz_progress (user_email, payload, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(user_email) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`)
    .bind(email, JSON.stringify({ version: 2, history: body.history, filters: body.filters }), updatedAt).run();
  return Response.json({ signedIn: true, updatedAt });
}
