import React from "react";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <Container
      id="cta"
      className="max-w-screen bg-bg dark:bg-neutral-800 border-y-[3px] border-zinc-900 dark:border-darkText/60"
    >
      <div className="py-16 px-4 mx-auto max-w-4xl">
        <div
          className="relative mx-auto w-full text-center
          border-[3px] border-zinc-900 dark:border-darkText/60
          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(248,244,221,0.3)]
          bg-white dark:bg-secondaryBlack rounded-xl p-8 md:p-12"
        >
          <div className="absolute -top-3 -right-3 px-4 py-2 bg-main border-[3px] border-zinc-900 dark:border-darkText/60 rounded-lg rotate-3">
            <span className="font-bold text-zinc-900">Free Trial</span>
          </div>

          <h2 className="mb-6 text-3xl md:text-4xl font-black text-zinc-900 dark:text-darkText/90">
            Begin Your Chinese Name Journey
          </h2>

          <p className="mb-8 text-lg font-medium text-zinc-800 dark:text-darkTextSecondary/80">
            Discover your perfect Chinese name today. No credit card required,
            start with 3 free name generations.
          </p>

          <Button
            asChild
            className={`
              px-8 py-6 text-lg font-bold
              border-[3px] border-zinc-900 dark:border-darkText/60
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]
              hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all
              bg-pink-500 hover:bg-pink-600 text-white dark:text-darkText
              rounded-xl
            `}
          >
            <Link href={"#"}>Get Your Chinese Name</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CTA;
