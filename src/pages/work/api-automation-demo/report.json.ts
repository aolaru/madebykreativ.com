import result from "../../../data/apiDemoResult.json";
export function GET() {
  return new Response(JSON.stringify(result,null,2),{headers:{"Content-Type":"application/json; charset=utf-8"}});
}
