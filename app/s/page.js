import Link from "next/link";

// Dynamic, like a search page: it reads its query on every request.
export default async function Search({ searchParams }) {
  const { page = "1" } = await searchParams;
  return (
    <main>
      <h1>Results page {page}</h1>
      <p>
        <Link href="/s?q=1&page=2">Page 2 (next/link to /s?q=1&amp;page=2)</Link>
      </p>
      <p>
        <Link href="/s?q=1">Page 1 (next/link to /s?q=1)</Link>
      </p>
      <p>
        <Link href="/s?q=1#a">Page 1, section A (next/link to /s?q=1#a)</Link>
      </p>
      <section id="a" style={{ height: "150vh" }}>
        Section A
      </section>
    </main>
  );
}
