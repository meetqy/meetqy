"use client";

import React from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Container from "@/components/global/container";

export enum plan {
  free = "free",
  pro = "pro",
}

export type Plan = {
  id: string;
  name: string;
  price: number | string;
  subText?: string;
  currency: string;
  features: string[];
  featured?: boolean;
  buttonText?: string;
  additionalFeatures?: string[];
  onClick: () => void;
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        "relative border-[3px] border-zinc-900 dark:border-darkText/60",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]",
        "bg-white dark:bg-secondaryBlack p-6 rounded-xl",
        "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all",
        plan.featured && "border-pink-600 dark:border-pink-600/60"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <p className="text-2xl font-bold text-zinc-900 dark:text-darkText/90">
            {plan.name}
          </p>
          {plan.featured && (
            <div className="font-bold text-sm px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded-lg rotate-3">
              Most Popular
            </div>
          )}
        </div>

        <div className="flex items-end gap-1 mt-4">
          <span className="text-xl font-bold text-zinc-800 dark:text-darkText/80">
            {plan.currency}
          </span>
          <span className="text-5xl font-black text-zinc-900 dark:text-darkText">
            {plan?.price}
          </span>
          <span className="text-lg text-zinc-700 dark:text-darkTextSecondary/80 mb-1">
            {plan.subText}
          </span>
        </div>

        <Button
          className={cn(
            "w-full mt-6 mb-8 px-4 py-6 text-lg font-bold",
            "border-[3px] border-zinc-900 dark:border-darkText/60",
            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]",
            "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all",
            "bg-main hover:bg-main/90 text-zinc-900"
          )}
          onClick={onClick}
        >
          {plan.buttonText}
        </Button>

        <div className="space-y-4">
          {plan.features.map((feature, idx) => (
            <Step key={idx}>{feature}</Step>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step = ({
  children,
  additional,
}: {
  children: React.ReactNode;
  additional?: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "h-5 w-5 rounded-lg border-2 border-zinc-900 dark:border-darkText/60",
          "flex items-center justify-center flex-shrink-0",
          "bg-pink-500 dark:bg-pink-600"
        )}
      >
        <IconCheck className="h-3 w-3 text-white dark:text-darkText" />
      </div>
      <span className="text-base font-medium text-zinc-800 dark:text-darkTextSecondary/80">
        {children}
      </span>
    </div>
  );
};

const Pricing = () => {
  const { toast } = useToast();

  const plans: Array<Plan> = [
    {
      id: plan.free,
      name: "Essential",
      price: 0.0,
      subText: "/forever",
      currency: "$",
      featured: true,
      features: [
        "3 AI-powered name generations",
        "Cultural meaning explanations",
        "Character analysis & stroke count",
        "Pinyin pronunciation guide",
        "Basic name compatibility check",
        "Name origin stories",
      ],
      buttonText: "Start Your Journey",
      additionalFeatures: ["Perfect for personal use"],
      onClick: () => {
        toast({
          title: "Welcome to Your Naming Journey!",
          description: "Begin exploring your perfect Chinese name",
        });
      },
    },
    {
      id: plan.pro,
      name: "Cultural Plus",
      price: 9.9,
      subText: "/month",
      currency: "$",
      features: [
        "Unlimited name generations",
        "Deep cultural significance analysis",
        "Regional style preferences",
        "Family name recommendations",
        "Business name consultations",
        "Priority support",
        "Downloadable name certificate",
      ],
      additionalFeatures: ["For those seeking deeper meaning"],
      buttonText: "Continue with Essential",
      onClick: () => {
        toast({
          title: "Great Choice!",
          description:
            "Start with our Essential plan to explore your perfect name.",
        });
      },
    },
  ];

  return (
    <Container
      id="pricing"
      className="max-w-screen bg-bg dark:bg-neutral-800 border-y-[3px] border-zinc-900 dark:border-darkText/60"
    >
      <h2 className="mb-14 px-5 text-center text-2xl font-black md:text-3xl lg:mb-20 lg:text-4xl text-zinc-900 dark:text-darkText/90">
        Choose Your Naming Journey
      </h2>
      <p className="text-center text-lg font-medium text-zinc-800 dark:text-darkTextSecondary/80 max-w-2xl mx-auto mb-12">
        Whether you're seeking a personal Chinese name or exploring cultural
        connections, we have the perfect plan for your journey.
      </p>
      <div className="mx-auto grid grid-cols-1 gap-8 mt-12 max-w-4xl md:grid-cols-2">
        {plans.map((tier) => (
          <Card plan={tier} key={tier.id} onClick={tier.onClick} />
        ))}
      </div>
    </Container>
  );
};

export default Pricing;
