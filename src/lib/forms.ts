// ——— Lead/contact form storage ————————————————————————————————————————
// Submissions POST to our own /api/lead endpoint (a Vercel function), which
// writes each one as a JSON file to Vercel Blob — no extra vendor.
// One-time setup in the Vercel project: Storage -> Create Blob store
// (auto-injects BLOB_READ_WRITE_TOKEN). Leads appear under leads/ there.
export const LEAD_ENDPOINT = '/api/lead/';
