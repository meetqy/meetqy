import React from 'react'
import {cn} from "@/lib/utils";

const Container = ({children, id, className}:
                   Readonly<{ children: React.ReactNode; id?: string; className?: string; }>
) => {
    return (
        <div id={id} className={cn(
            "w-full px-8 py-10 lg:px-4 max-w-3xl mx-auto",
            className
        )}>{children}</div>
    )
}
export default Container
