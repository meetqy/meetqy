import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/global/container";

export default function Faq() {
  return (
    <Container
      id="faq"

    >
      <h2 className="mb-14 px-5 text-center text-2xl font-black md:text-3xl lg:mb-20 lg:text-4xl text-zinc-900 dark:text-darkText/90">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto max-w-3xl">
        <Accordion
          className="text-base sm:text-lg space-y-6"
          type="single"
          collapsible
        >
          {[
            {
              question: "How does NameSage generate Chinese names?",
              answer:
                "NameSage uses advanced AI to analyze your English name, occupation, and personality traits to create meaningful Chinese names that reflect your identity while following traditional Chinese naming conventions and cultural significance.",
            },
            {
              question: "Are the generated names culturally appropriate?",
              answer:
                "Yes! Our AI model is trained on proper Chinese naming conventions and cultural context. Each name is carefully generated to be respectful, meaningful, and suitable for professional use while maintaining cultural authenticity.",
            },
            {
              question: "Can I get multiple name suggestions?",
              answer:
                "Absolutely! NameSage provides multiple name options for each request, along with detailed explanations of their meanings and cultural significance. This allows you to choose the name that best resonates with your identity.",
            },
            {
              question: "What information do I need to provide?",
              answer:
                "To generate the most suitable Chinese name, we recommend providing your English name, occupation, and any specific personality traits or preferences. The more context you provide, the more personalized your Chinese name will be.",
            },
          ].map((item, index) => (
            <AccordionItem
              key={`item-${index + 1}`}
              value={`item-${index + 1}`}
              className="relative border-[3px] border-zinc-900 dark:border-darkText/60
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]
                bg-white dark:bg-secondaryBlack rounded-xl overflow-hidden
                group"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="text-left font-bold text-zinc-900 dark:text-neutral-900">
                    {item.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-zinc-800 dark:text-darkTextSecondary/80 font-medium">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
}
