import "./index.css";

export default async function MyProducts() {
  let htmlContent = "";
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/meetqy/meetqy/refs/heads/main/README.md",
      { next: { revalidate: 3600 } },
    );
    htmlContent = await res.text();
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  if (!htmlContent) return null;

  return (
    <section className="site-links">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </section>
  );
}
