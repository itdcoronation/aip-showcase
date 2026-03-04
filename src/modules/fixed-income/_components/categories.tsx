import {
  bondsImg,
  cashManagementImg,
  commercialPapersImg,
  executionImg,
  treasuryBillsImg,
} from "@/assets/images";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FixedIncomeCategories = () => {
  return (
    <section className="overflow-auto">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Invest in fixed icome
          </p>
          <p className="text-p4 text-txt-secondary">
            Select category to see more product details
          </p>
        </div>
        <div className="flex gap-2">
          <Button size={"icon"} variant={"outline"} className="rounded-full">
            <ChevronLeft size={18} className="!w-[18px] !h-[18px]" />
          </Button>
          <Button size={"icon"} variant={"outline"} className="rounded-full">
            <ChevronRight size={18} className="!w-[18px] !h-[18px]" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-auto w-full pb-2">
        {categories.map((item) => (
          <FixedIncomeCategoryCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};

const categories: FixedIncomeCategoryData[] = [
  {
    title: "Bonds",
    image: bondsImg.src,
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis platea placerat ac phasellus habitasse dictum sed viverra.",
  },
  {
    title: "Commercial papers",
    image: commercialPapersImg.src,
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis platea placerat ac phasellus habitasse dictum sed viverra.",
  },
  {
    title: "Treasury Bills",
    image: treasuryBillsImg.src,
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis platea placerat ac phasellus habitasse dictum sed viverra.",
  },
  {
    title: "Cash management",
    image: cashManagementImg.src,
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis platea placerat ac phasellus habitasse dictum sed viverra.",
  },
  {
    title: "Execution only",
    image: executionImg.src,
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis platea placerat ac phasellus habitasse dictum sed viverra.",
  },
];

interface FixedIncomeCategoryData {
  title: string;
  description: string;
  image: string;
}

const FixedIncomeCategoryCard = ({
  title,
  description,
  image,
}: FixedIncomeCategoryData) => {
  return (
    <Link
      href={`/fixed-income/category?category=${title}`}
      className="shadow-sm border border-stroke-primary rounded-[24px] p-1.5 pb-3 min-w-[215px]"
    >
      <Image
        className="rounded-[18px] mb-2"
        alt=""
        src={image}
        width={213}
        height={125}
      />
      <div>
        <p className="text-p2 text-txt-primary mb-1">{title}</p>
        <p className="text-xs text-txt-secondary">{description}</p>
      </div>
    </Link>
  );
};
