"use client";

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

import * as React from "react";

import {Button} from "@/components/ui/button";

export function ThemeSwitcher() {
    const {setTheme, theme} = useTheme();
    return (
        <Button
            className="h-11 w-11 m500:h-9 m500:w-9 p-0 hover:!translate-x-[4px] hover:!translate-y-[4px] !bg-white dark:!bg-secondaryBlack"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun
                className="!h-6 !w-6 m500:h-4 m500:w-4 hidden dark:inline stroke-darkText"
                strokeWidth={3}
            />
            <Moon
                className="!h-6 !w-6 m500:h-4 m500:w-4 inline dark:hidden stroke-text"
                strokeWidth={3}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
