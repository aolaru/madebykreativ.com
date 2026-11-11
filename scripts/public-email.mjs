import { Parser } from "htmlparser2";
import { site } from "../src/data/site.ts";

export function publicEmailLinks(html, { requireExemption = false } = {}) {
  const links = [];
  let exempt = false;
  const parser = new Parser({
    oncomment(comment) {
      if (comment === "email_off") {
        if (exempt) throw new Error("Nested email obfuscation exemptions");
        exempt = true;
      } else if (comment === "/email_off") {
        if (!exempt) throw new Error("Unmatched email obfuscation exemption");
        exempt = false;
      }
    },
    onopentag(name, attributes) {
      if (name !== "a" || !attributes.href?.toLowerCase().startsWith("mailto:"))
        return;
      const address = decodeURIComponent(
        new URL(attributes.href).pathname,
      ).toLowerCase();
      if (address !== site.email.toLowerCase()) return;
      if (requireExemption && !exempt)
        throw new Error(
          "Public contact email is missing its Cloudflare exemption",
        );
      links.push(attributes.href);
    },
  });
  parser.end(html);
  if (exempt) throw new Error("Unclosed email obfuscation exemption");
  return links;
}

export function requirePublicEmailLink(html) {
  if (!publicEmailLinks(html).length)
    throw new Error(
      "Public contact email was removed or rewritten; the no-JavaScript fallback is unavailable",
    );
}
