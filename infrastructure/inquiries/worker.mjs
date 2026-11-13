import { EmailMessage } from "cloudflare:email";
import { handleInquiry } from "./handler.mjs";
export default {
  fetch(request, env) {
    return handleInquiry(
      request,
      env,
      (from, to, raw) => new EmailMessage(from, to, raw),
    );
  },
};
