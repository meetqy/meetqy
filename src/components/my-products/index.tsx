import { marked } from "marked";
import "./index.css";

export default async function MyProducts() {
  let htmlContent = "";
  try {
    const res = await fetch("https://raw.githubusercontent.com/meetqy/meetqy/refs/heads/main/README.md", { next: { revalidate: 3600 } });
    const content = await res.text();
    htmlContent = await marked.parse(content);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  if (!htmlContent) return null;

  return <div className="my-products" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
