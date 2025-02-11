import React from "react";
import Container from "@/components/global/container";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, History, Globe2, Shield, Scroll } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  // 为每个卡片设置不同的旋转角度，创造不规则的视觉效果
  const rotations = [
    "-rotate-1",
    "rotate-1",
    "-rotate-2",
    "rotate-2",
    "-rotate-1",
    "rotate-1",
  ];

  return (
    <div
      className={`relative ${rotations[index]} transition-transform hover:rotate-0 hover:scale-[1.02]`}
    >
      <Card
        className="relative border-[3px] border-zinc-900 dark:border-darkText/60
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]
        bg-white dark:bg-secondaryBlack p-6 rounded-xl overflow-hidden
        hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border-[3px] border-zinc-900 dark:border-darkText/60 bg-main">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-darkText/90">
              {title}
            </h3>
          </div>
          <p className="text-base font-medium text-zinc-800 dark:text-darkTextSecondary/80">
            {description}
          </p>
        </div>
      </Card>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "AI-Powered Naming",
      description:
        "Utilizing advanced AI technology to generate unique and meaningful Chinese names based on your personal characteristics and preferences.",
    },
    {
      icon: <Brain className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "Cultural Wisdom",
      description:
        "Incorporating traditional Chinese cultural essence to ensure each name aligns with cultural values and traditional naming conventions.",
    },
    {
      icon: <History className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "Personalized Analysis",
      description:
        "Providing detailed explanations of character meanings, cultural context, and how each name reflects your personal traits.",
    },
    {
      icon: <Globe2 className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "Cultural Bridge",
      description:
        "Helping non-Chinese speakers obtain names that honor both their original identity and Chinese cultural heritage.",
    },
    {
      icon: <Shield className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "Professional Review",
      description:
        "Implementing strict name verification to ensure each generated name is both elegant and practical for modern use.",
    },
    {
      icon: <Scroll className="w-6 h-6 text-zinc-900" strokeWidth={2.5} />,
      title: "Story Integration",
      description:
        "Each name comes with a unique personal story, adding deeper meaning to your Chinese name journey.",
    },
  ];

  return (
    <Container id="features" className="max-w-screen bg-bg dark:bg-neutral-800 border-y-[3px] border-zinc-900 dark:border-darkText/60">
      <h2 className="mb-14 px-5 text-center text-2xl font-black md:text-3xl lg:mb-20 lg:text-4xl text-zinc-900 dark:text-darkText/90">
        Why Choose Our Naming Service
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </Container>
  );
};

export default Features;
