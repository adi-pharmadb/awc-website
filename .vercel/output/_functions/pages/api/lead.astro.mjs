export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  if (body.botcheck) return Response.json({ ok: true, stored: false });
  body.form === "contact" ? "contact" : "dosha-quiz";
  const email = String(body.email ?? "").slice(0, 200);
  const name = String(body.name ?? "").slice(0, 200);
  if (!email.includes("@") || !name) {
    return Response.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  {
    return Response.json({ ok: true, stored: false });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
