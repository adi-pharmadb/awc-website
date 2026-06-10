import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';

// Form submissions (dosha quiz leads + contact messages) are stored as JSON
// files in Vercel Blob — no extra vendor. One-time setup in the Vercel
// project: Storage -> Create Blob store (this injects BLOB_READ_WRITE_TOKEN).
// Submissions then appear under leads/ in the Blob browser.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // honeypot: bots fill it, humans never see it
  if (body.botcheck) return Response.json({ ok: true, stored: false });

  const form = body.form === 'contact' ? 'contact' : 'dosha-quiz';
  const email = String(body.email ?? '').slice(0, 200);
  const name = String(body.name ?? '').slice(0, 200);
  if (!email.includes('@') || !name) {
    return Response.json({ ok: false, error: 'missing fields' }, { status: 400 });
  }

  if (!import.meta.env.BLOB_READ_WRITE_TOKEN) {
    // local dev / store not yet created: accept gracefully, store nothing
    return Response.json({ ok: true, stored: false });
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  await put(
    `leads/${form}/${stamp}.json`,
    JSON.stringify({ ...body, receivedAt: new Date().toISOString() }, null, 2),
    { access: 'public', addRandomSuffix: true, contentType: 'application/json' },
  );
  return Response.json({ ok: true, stored: true });
};
