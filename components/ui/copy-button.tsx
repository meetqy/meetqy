"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  stripMarkdown?: boolean;
}

const stripMarkdownFormat = (markdown: string) => {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/`{3}.*?\n([\s\S]*?)`{3}/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^\s*[-+*]\s/gm, "")
    .replace(/^\s*\d+\.\s/gm, "")
    .trim();
};

export function CopyButton({
  value,
  stripMarkdown = true,
  className,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  const handleCopy = () => {
    const textToCopy = stripMarkdown ? stripMarkdownFormat(value) : value;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
  };

  return (
    <Button
      size="icon"
      className={className}
      onClick={handleCopy}
      {...props}
    >
      {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
