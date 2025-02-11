"use client";

import Link from "next/link";
import React, { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/global/theme-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <Image src="/logo.png" width={28} height={28} alt={"namesage"} />
      <span className=" text-black text-2xl dark:text-amber-400 font-semibold font-mono">
        NameSage
      </span>
    </Link>
  );
};

const DesktopNav = ({ navItems }: any) => {
  return (
    <>
      {navItems.map((navItem: any, idx: number) => (
        <Link
          className="text-black dark:text-darkText font-semibold"
          key={`link=${idx}`}
          href={navItem.link}
        >
          <span>{navItem.name}</span>
        </Link>
      ))}
    </>
  );
};

const MobileNav = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconMenu2 onClick={() => setOpen(!open)} />
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 bg-[#fffaf0] dark:bg-neutral-900 z-50 flex flex-col justify-center items-center space-y-10 text-xl font-bold">
            <IconX
              className="absolute right-8 top-8 h-5 w-5 text-black dark:text-amber-400"
              onClick={() => setOpen(!open)}
            />
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className="relative text-black dark:text-amber-400 hover:opacity-70 transition-opacity"
              >
                <motion.span className="block">{navItem.name}</motion.span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navbar = () => {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "FAQ",
      link: "#faq",
    },
  ];
  return (
    <div className="flex flex-row items-center justify-between py-2 w-full mx-auto px-8 relative z-[60] bg-white dark:border-darkBorder dark:bg-secondaryBlack shadow-light">
      <div className="flex flex-row items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:flex hidden items-center justify-center space-x-8 lg:space-x-14">
          <DesktopNav navItems={navItems} />
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild={true}
            className="h-11 w-11 m500:h-9 m500:w-9 p-0 hover:!translate-x-[4px] hover:!translate-y-[4px] !bg-white dark:!bg-secondaryBlack"
          >
            <Link href="https://x.com/hellokaton" target="_blank">
              <svg
                className="!h-6 !w-6 m500:h-4 m500:w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  className="fill-text dark:fill-darkText"
                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                />
              </svg>
            </Link>
          </Button>
          <Button
              asChild={true}
              className="h-11 w-11 m500:h-9 m500:w-9 p-0 hover:!translate-x-[4px] hover:!translate-y-[4px] !bg-white dark:!bg-secondaryBlack"
          >
            <Link href="https://github.com/hellokaton" target="_blank">
              <svg role="img" className="!h-6 !w-6 m500:h-4 m500:w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>GitHub</title>
                <path
                    className="fill-text dark:fill-darkText"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </Link>
          </Button>
          <ThemeSwitcher/>
          <div className="flex lg:hidden">
            <MobileNav navItems={navItems}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
