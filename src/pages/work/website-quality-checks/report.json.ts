import { qaSample } from "../../../data/caseStudies";
export function GET() {
  return new Response(JSON.stringify(qaSample, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="kreativ-sample-qa-finding.json"',
    },
  });
}
