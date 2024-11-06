export const dynamic = 'force-dynamic' 

export async function GET(request: Request) {
  const header = new Headers();
  header.append("Accept", "application/json");
  header.append("Origin", "http://hex.localhost");

  const res = await fetch("http://localhost:8000/api/boardgames", {
    headers: header,
  });

  if (!res.ok) {
    throw new Error("Fail to Fetch");
  }

  const data = await res.json();

  let boardgames = data.data;

  return Response.json( boardgames )
}
