import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Faq from "@/components/faq";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import Features from "@/components/features";
import CAT from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf0] dark:bg-neutral-900 relative">
      {/* 网格背景层 */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#64748b25_1px,transparent_1px),linear-gradient(to_bottom,#64748b25_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#94a3b820_1px,transparent_1px),linear-gradient(to_bottom,#94a3b820_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden="true"
      />
      {/* 内容层 */}
      <div className="w-full relative overflow-hidden">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
        <CAT />
        <Footer />
      </div>
    </main>
  );
}
