function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.WAITLIST) return json({ error: "Waitlist storage is not connected yet." }, 503);

  const origin = request.headers.get("Origin");
  const requestUrl = new URL(request.url);
  if (origin) {
    try {
      if (new URL(origin).origin !== requestUrl.origin) return json({ error: "This request could not be accepted." }, 403);
    } catch {
      return json({ error: "This request could not be accepted." }, 403);
    }
  }

  let payload;
  try {
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) return json({ error: "Please submit the form again." }, 415);
    const raw = await request.text();
    if (raw.length > 2048) return json({ error: "That request is too large." }, 413);
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "Please submit the form again." }, 400);
  }

  if (typeof payload.website === "string" && payload.website.trim()) return json({ ok: true });
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  const key = `signup:${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const duplicate = await env.WAITLIST.get(key);
  if (duplicate) return json({ ok: true, duplicate: true });

  await env.WAITLIST.put(key, JSON.stringify({ email, joinedAt: new Date().toISOString() }));
  return json({ ok: true, duplicate: false }, 201);
}
