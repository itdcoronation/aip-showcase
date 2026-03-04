"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What Are Mutual Funds?",
    answer:
      "Mutual funds are type of investment vehicle that pools money from multiple investors to purchase a diversified portfolio of assets, such as stocks, bonds, money market instruments, or other securities.",
  },
  {
    question: "What types of funds are available for investment?",
    answer:
      "You can invest in the following funds in Coronation Asset Management:\n• Coronation Money Market Fund: Invests in low risk short-term Money Market Instruments such as Treasury Bills, Commercial papers and Term deposits which is a fixed investment where money is invested for a specific period and earn a guaranteed interest rate.\n• Coronation Balanced Fund: Invests in a mix of asset classes, typically equities, bonds, and sometimes money market instruments.\n• Coronation Fixed Income Fund: Invests in Government Bonds, Treasury Bills, Corporate Bonds and Commercial Papers",
  },
  {
    question: "What is the minimum deposit required to invest?",
    answer: "The minimum deposit for all funds is N10,000.",
  },
  {
    question: "How do I invest in a fund on the Coronation WealthHub?",
    answer:
      "Navigate to the Invest section on the Coronation WealthHub portal, select your preferred fund, enter the amount, and confirm the transaction.",
  },
  {
    question: "Can I invest in more than one mutual fund?",
    answer: "Yes, you can invest in any or all our mutual funds.",
  },
  {
    question: "How long should I stay invested in Mutual Funds?",
    answer:
      "Mutual Funds investment is open-ended and so there is no minimum period of participation. However, it is usually advised that, investments in the Fund should be viewed as long-term investments as returns are best optimized over the long term.",
  },
  {
    question:
      "When is the cut-off period for Coronation subscription requests?",
    answer:
      "The cut-off period for subscription request is 12pm. Subscription requests received past the cut-off period will be processed the next working day.",
  },
  {
    question: "How often do I get dividends on my investment?",
    answer:
      "Dividends are typically distributed according to the specific dividend schedule of each fund.\n• Coronation Fixed Income Fund – Paid semi-annually\n• Coronation Money Market Fund – Paid Quarterly\n• Coronation Balanced Fund – Paid Annually",
  },
  {
    question: "What does it mean that dividends are accrued daily?",
    answer:
      "This means your dividend earnings are calculated every day, based on the amount you’ve invested and the prevailing yield of the fund. These earnings are then paid out according to the fund's dividend payment schedule.",
  },
  {
    question: "Can I reinvest my dividends?",
    answer:
      "Yes, you have the option to either receive your dividends as a payout or reinvest them, allowing your investment to grow over time.",
  },
  {
    question: "Where can I see my accrued dividends?",
    answer:
      "You can view your accrued dividends on the Coronation WealthHub Portal.",
  },
  {
    question:
      "How do I redeem my investment on the Coronation WealthHub Portal?",
    answer:
      "Go to the Redeem section, select the fund, enter the amount, and confirm. Your redemption proceeds will be sent to your registered account number.",
  },
  {
    question: "What is the redemption process timeline?",
    answer:
      "The proceeds from your redemption requests will be processed and disbursed within 24 working hours. (Excluding weekends and public holidays)",
  },
  {
    question: "When is the cut-off period for redemption requests?",
    answer:
      "The cut-off period for redemption request is 2pm. Redemption requests received past the cut-off period will be processed the next working day.",
  },
  {
    question: "Is there a limit to the amount I can redeem online?",
    answer:
      "Yes, you can only redeem a cumulative amount of N3,000,000 daily through the Coronation WealthHub Portal.",
  },
];

const FaqsUI = () => {
  const [state, setState] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const filteredFaqs = faqs.filter(({ question, answer }) =>
    question.toLowerCase().includes(search.toLowerCase()) ||
    answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-md">
      <div className="mb-8">
        <h2 className="font-semibold text-h4 md:text-h3 text-txt-primary mb-2">
          Frequently Ask Questions
        </h2>
        <p className="text-xs md:text-sm text-txt-tertiary mb-4">
          Have any questions? We are here to help.
        </p>
        <Input
          startElement={
            <SearchIcon
              width={20}
              height={20}
              strokeWidth={1}
              stroke="#56575D"
            />
          }
          startOffset="40px"
          placeholder="Search"
          className="bg-white"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div>
        <Accordion
          value={state}
          onValueChange={setState}
          className="grid gap-4"
          type="single"
          collapsible
        >
          {filteredFaqs.map(({ question, answer }, index) => (
            <AccordionItem
              key={`faq-${index}`}
              className={cn(
                "shadow-sm border border-stroke-primary rounded-md bg-bg-secondary px-4",
                state === `faq-${index}` ? "bg-bg-primary" : "bg-bg-secondary"
              )}
              value={`faq-${index}`}
            >
              <AccordionTrigger
                isOpen={state === `faq-${index}`}
                className={cn(
                  "text-txt-primary",
                  state === `faq-${index}` ? "font-semibold" : ""
                )}
              >
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-txt-secondary whitespace-break-spaces">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { FaqsUI };
