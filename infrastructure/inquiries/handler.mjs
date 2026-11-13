import { createMimeMessage, Mailbox } from "mimetext/browser";

export const serviceIds = [
  "qa-audit",
  "wordpress-repair",
  "api-automation",
  "wordpress-plugin",
  "chrome-extension",
  "android-app",
  "web-tool",
  "other",
];
export const sources = [
  "direct",
  "home",
  "services",
  "wordpress",
  "qa-api-testing",
  "work",
  "about",
];
const origin = "https://madebykreativ.com";
const maxBytes = 65536;

export function validateInquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid inquiry.");
  const values = {};
  for (const [key, limit] of Object.entries({
    name: 80,
    email: 254,
    service: 40,
    summary: 1500,
    functionality: 1000,
    budget: 20,
    deadline: 10,
    links: 500,
    source: 30,
    consent: 3,
    website: 200,
  })) {
    if (input[key] !== undefined && typeof input[key] !== "string")
      throw new Error("Invalid field value.");
    const value = (input[key] || "").trim();
    if (value.length > limit || value.includes("\u0000"))
      throw new Error("Please shorten the inquiry.");
    values[key] = value;
  }
  if (
    values.website ||
    !serviceIds.includes(values.service) ||
    !values.summary ||
    values.consent !== "yes"
  )
    throw new Error(
      "Choose a project type, describe the problem and confirm sending these details.",
    );
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
    /[\r\n]/.test(values.email + values.name)
  )
    throw new Error("Enter a valid reply email address.");
  if (
    values.budget &&
    (!Number.isFinite(Number(values.budget)) ||
      Number(values.budget) < 0 ||
      Number(values.budget) > 1000000)
  )
    throw new Error(
      "Enter a budget between 0 and 1000000 EUR, or leave it blank.",
    );
  if (
    values.deadline &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(values.deadline) ||
      Number.isNaN(Date.parse(values.deadline)) ||
      new Date(values.deadline).toISOString().slice(0, 10) !== values.deadline)
  )
    throw new Error("Enter a valid date.");
  if (values.links) {
    let url;
    try {
      url = new URL(values.links);
    } catch {
      throw new Error("Enter an HTTP or HTTPS public link.");
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      throw new Error(
        "Enter an HTTP or HTTPS public link without credentials.",
      );
  }
  if (!sources.includes(values.source)) values.source = "direct";
  return values;
}

export function inquiryBody(values, reference) {
  return [
    "Website project inquiry",
    `Reference: ${reference}`,
    `Source: ${values.source}`,
    `Package: ${values.service}`,
    `Name: ${values.name || "Not provided"}`,
    `Reply email: ${values.email}`,
    "",
    values.summary,
    "",
    `Required functionality: ${values.functionality || "To discuss"}`,
    `Approximate budget (EUR): ${values.budget || "To discuss"}`,
    `Desired deadline: ${values.deadline || "To discuss"}`,
    `Public link: ${values.links || "Not provided"}`,
    "",
    "The sender confirmed sending these details for this inquiry. No automatic client reply has been sent.",
  ].join("\n");
}

function respond(request, status, message, reference) {
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  };
  if (status === 429) headers["Retry-After"] = "60";
  if (request.headers.get("Accept")?.includes("application/json"))
    return Response.json(
      { ok: status === 200, message, ...(reference ? { reference } : {}) },
      { status, headers },
    );
  // Only fixed messages and a server-generated UUID are rendered, never visitor input.
  const safe = message.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
  headers["Content-Type"] = "text/html; charset=utf-8";
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Project inquiry | Made by KREATIV</title><style>body{font:18px/1.6 system-ui;max-width:42rem;margin:4rem auto;padding:1rem;color:#172235;background:#f3f6fb}a{color:#176840}code{overflow-wrap:anywhere}</style><main><p>Made by KREATIV</p><h1>${status === 200 ? "Thank you for your inquiry" : "Inquiry not confirmed"}</h1><p>${safe}</p>${reference ? `<p>Reference: <code>${reference}</code></p>` : ""}<p><a href="${origin}/contact/#project-inquiry">Return to Contact</a></p><p><a href="mailto:info@madebykreativ.com">Email Andrei directly</a></p></main></html>`,
    { status, headers },
  );
}

async function readInput(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing inquiry.");
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        throw new Error("Inquiry exceeds the size limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const body = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (request.headers.get("Content-Type")?.split(";")[0] === "application/json")
    return JSON.parse(body);
  const params = new URLSearchParams(body);
  for (const key of params.keys())
    if (params.getAll(key).length !== 1) throw new Error("Duplicate field.");
  return Object.fromEntries(params);
}

export async function handleInquiry(request, env, createEmail) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/inquiry")
    return respond(request, 404, "Not found.");
  const configured = Boolean(
    env.INQUIRY_EMAIL?.send &&
    env.INQUIRY_LIMIT?.limit &&
    env.DESTINATION_EMAIL,
  );
  if (request.method === "GET")
    return Response.json(
      { status: configured ? "ready" : "unavailable", version: "2026-11-13" },
      {
        status: configured ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  if (request.method !== "POST")
    return respond(request, 405, "Use the project inquiry form.");
  if (
    request.headers.get("Origin") !== origin ||
    request.headers.get("Sec-Fetch-Site") === "cross-site"
  )
    return respond(request, 403, "Use the form on madebykreativ.com.");
  if (!configured)
    return respond(
      request,
      503,
      "Inquiry delivery is unavailable. Please use the direct email link.",
    );
  const type = request.headers.get("Content-Type")?.split(";")[0];
  if (!["application/json", "application/x-www-form-urlencoded"].includes(type))
    return respond(request, 415, "Unsupported submission format.");
  if (Number(request.headers.get("Content-Length")) > maxBytes)
    return respond(request, 413, "Please shorten the inquiry.");
  let values;
  try {
    values = validateInquiry(await readInput(request));
  } catch {
    return respond(
      request,
      400,
      "Check your reply email, project type, description and sending confirmation. Keep the brief within the field limits.",
    );
  }
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip)
    return respond(
      request,
      503,
      "Inquiry delivery is unavailable. Please use the direct email link.",
    );
  try {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const key = Array.from(new Uint8Array(hash), (x) =>
      x.toString(16).padStart(2, "0"),
    ).join("");
    if (!(await env.INQUIRY_LIMIT.limit({ key })).success)
      return respond(
        request,
        429,
        "Too many inquiries. Wait a minute before trying again, or use email.",
      );
    const reference = crypto.randomUUID();
    const message = createMimeMessage();
    message.setSender({
      name: "Made by KREATIV inquiries",
      addr: "info@madebykreativ.com",
    });
    message.setRecipient(env.DESTINATION_EMAIL);
    message.setHeader("Reply-To", new Mailbox({ addr: values.email }));
    message.setSubject(`Website inquiry: ${values.service} [${reference}]`);
    message.addMessage({
      contentType: "text/plain",
      data: inquiryBody(values, reference),
    });
    await env.INQUIRY_EMAIL.send(
      createEmail(
        "info@madebykreativ.com",
        env.DESTINATION_EMAIL,
        message.asRaw(),
      ),
    );
    return respond(
      request,
      200,
      "Your inquiry has been accepted for email delivery. Andrei will review the fit and availability before discussing a proposal. Keep the reference below for follow-up.",
      reference,
    );
  } catch {
    // Provider errors can contain addresses or message content; never log or reflect them.
    return respond(
      request,
      502,
      "Delivery could not be confirmed. Please use the direct email link; do not assume the inquiry was received.",
    );
  }
}
