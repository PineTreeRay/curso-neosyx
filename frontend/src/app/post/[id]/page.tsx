
const Page = ({ params }: { params: { id: string } }) => {
  return (
    <main>
      <h1>Post ID: {params.id}</h1>
      <p>Página para o post ID: {params.id}</p>
    </main>
  );
};

export default Page;

//  [id].tsx
// [id]/page.tsx
