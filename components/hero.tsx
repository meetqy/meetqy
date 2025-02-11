"use client";

import {motion} from "framer-motion";
import React from "react";
import {Button} from "@/components/ui/button";
import {FeaturedImages} from "@/components/featured-images";
import FormDialog from "@/components/form-dialog";
import {ArrowRight} from "lucide-react";

export default function Hero() {
    return (
        <div
            className="relative mt-16 md:mt-0 md:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-8 md:px-8">
            <div className="relative flex flex-col items-center justify-center md:mt-32">
                <FeaturedImages/>
                <h1 className="text-3xl md:text-5xl lg:text-7xl tracking-tight font-bold mt-8 mb-8 relative text-center text-zinc-700 dark:text-darkText max-w-6xl mx-auto ">
                    Authentic{" "}
                    <span
                        className="relative bg-clip-text text-transparent bg-gradient-to-b from-pink-500 to-pink-600 z-10">
            Chinese names
          </span>{" "}
                    personal stories
                    <span className="hidden md:inline-block">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-14 w-14 stroke-indigo-500 stroke-[1px]"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <motion.path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <motion.path
                  initial={{
                      pathLength: 0,
                      fill: "#a5b4fc",
                      opacity: 0,
                  }}
                  animate={{
                      pathLength: 1,
                      fill: "#a5b4fc",
                      opacity: 1,
                  }}
                  transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear",
                      repeatDelay: 0.5,
                  }}
                  d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
              />
            </svg>
          </span>
                </h1>
                <h2 className="relative font-regular text-base md:text-xl text-zinc-500 dark:text-darkTextSecondary tracking-wide mb-8 text-center max-w-xl mx-auto antialiased">
                    Transform your identity into a meaningful Chinese name that reflects
                    who you are. Powered by AI, crafted with cultural wisdom.
                </h2>
            </div>
            <div className="relative z-10 group mt-8 mb-10">
                <FormDialog/>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 text-center">
                    Free to try • No credit card required
                </p>
            </div>
        </div>
    );
}
