export async function GET() {
  return new Response(JSON.stringify({ message: "get boards" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
