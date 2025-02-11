"use client";
import Image from "next/image";

import React, {useEffect, useState} from "react";

import {animate, AnimatePresence, motion, stagger, useMotionValue, useSpring, useTransform,} from "framer-motion";
import {twMerge} from "tailwind-merge";
import {cn} from "@/lib/utils";

const testimonials = [
    {
        name: "John Doe",
        designation: "Software Engineer",
        image:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    {
        name: "Robert Johnson",
        designation: "Product Manager",
        image:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=256&q=60",
    },
    {
        name: "Jane Smith",
        designation: "Data Scientist",
        image:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=256&q=60",
    },
    {
        name: "Emily Davis",
        designation: "UX Designer",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=256&q=60",
    },
    {
        name: "Tyler Durden",
        designation: "Soap Developer",
        image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    {
        name: "Dora",
        designation: "The Explorer",
        image:
            "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
];

export const FeaturedImages = ({
                                   textClassName,
                                   className,
                                   showStars = false,
                                   containerClassName,
                               }: {
    textClassName?: string;
    className?: string;
    showStars?: boolean;
    containerClassName?: string;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const springConfig = {stiffness: 100, damping: 5};
    const x = useMotionValue(0);
    const translateX = useSpring(
        useTransform(x, [-100, 100], [-50, 50]),
        springConfig
    );

    const handleMouseMove = (event: any) => {
        const halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth);
    };

    useEffect(() => {
        animate(
            ".animation-container",
            {
                scale: [1.1, 1, 0.9, 1],
                opacity: [0, 1],
            },
            {duration: 0.4, delay: stagger(0.1)}
        );
    }, []);
    return (
        <div
            className={cn(
                "flex flex-col items-center ",
                containerClassName
            )}
        >
            <div
                className={twMerge(
                    "flex flex-col sm:flex-row items-center justify-center mb-2",
                    className
                )}
            >
                <div className="flex flex-row items-center mb-4 sm:mb-0">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            className="-mr-4  relative group"
                            key={testimonial.name}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatePresence>
                                {hoveredIndex === idx && (
                                    <motion.div
                                        initial={{opacity: 0, y: 20, scale: 0.6}}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 160,
                                                damping: 20,
                                            },
                                        }}
                                        exit={{opacity: 0, y: 20, scale: 0.6}}
                                        style={{
                                            translateX: translateX,

                                            whiteSpace: "nowrap",
                                        }}
                                        className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-neutral-900 z-50 shadow-xl px-4 py-2"
                                    >
                                        <div
                                            className="absolute inset-x-0 z-30 w-[20%] mx-auto -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px "/>
                                        <div
                                            className="absolute inset-x-0 w-[70%] mx-auto z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px "/>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-white relative z-30 text-sm">
                                                {testimonial.name}
                                            </div>
                                            <div
                                                className="text-neutral-300 text-xs px-1 py-0.5 rounded-sm bg-neutral-950">
                                                {testimonial.designation}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="animation-container">
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        rotate: `${Math.random() * 15 - 5}deg`,
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        zIndex: 30,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className="rounded-2xl overflow-hidden border-2  border-neutral-200  relative"
                                >
                                    <Image
                                        onMouseMove={handleMouseMove}
                                        height={100}
                                        width={100}
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="object-cover object-top  h-14 w-14 "
                                    />
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
                {/*<div className="flex justify-center ml-6">*/}
                {/*    {[...Array(5)].map((_, index) => (*/}
                {/*        <BsStarFill*/}
                {/*            key={index}*/}
                {/*            className={showStars ? "h-4 w-4 text-yellow-400 mx-1" : "hidden"}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
            <p
                className={twMerge(
                    "text-neutral-400 text-sm text-center ml-8 relative z-40",
                    textClassName
                )}
            >
                Trusted by 12,080+ users
            </p>
        </div>
    );
};
