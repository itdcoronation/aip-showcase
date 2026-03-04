import { fixedIncomeImg, mutualFundImg, trusteeImg } from "@/assets/images";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

export const Services = () => {
  const services: ServiceDto[] = [
    {
      title: "Mutual funds",
      description:
        "Mutual funds are type of investment vehicle that pools money from multiple investors to purchase a diversified portfolio of assets,such as stocks, bonds, money market instruments, or other securities.",
      image: mutualFundImg,
      bgClassName: "bg-[url('/mutual-fund-bg.svg')]",
      titleClassName: "text-[#6E3D01] bg-[#FEBE71]",
      descriptionClassName: "bg-[#FFEED3]",
      path: "/mutual-funds",
    },
      {
      title: "Equities",
      description:
        "Equities represent ownership in a company and constitute a claim on part of the company’s assets and earnings.Stock ownership gives shareholders access to potential capital gains and dividends.",
      image: fixedIncomeImg,
      bgClassName: "bg-[url('/fixed-income-bg.svg')]",
      titleClassName: "text-[#330A62] bg-[#CBA5F8]",
      descriptionClassName: "bg-[#FAEFFF]",
      path: "/equities",
    },
     {
      title: "Trustees",
      description:
        "Providing professional and independent trust services to protect assets, manage estates, and ensure clients’ wishes are carried out with transparency and integrity.",
      image: trusteeImg,
      titleClassName: "text-[#0E3C72] bg-[#84BAF8]",
      descriptionClassName: "bg-[#EEF5FF]",
      bgClassName: "bg-[url('/trustee-bg.svg')]",
      disabled: true,
      path: "/trustees",
    },
    {
      title: "Fixed income",
      description:
        "A medium-risk investment option focused on generating steady income through government and corporate bonds, while preserving capital and ensuring liquidity",
      image: fixedIncomeImg,
      bgClassName: "bg-[url('/fixed-income-bg.svg')]",
      titleClassName: "text-[#330A62] bg-[#CBA5F8]",
      descriptionClassName: "bg-[#FAEFFF]",
      disabled: true,
      path: "/fixed-income",
    },
   
  ];
  return (
    <section className="overflow-auto">
      <div className="flex gap-2 min-w-[750px]">
        {services.map((service) => (
          <ServiceCard {...service} key={service.title} />
        ))}
      </div>
    </section>
  );
};

interface ServiceDto {
  title: string;
  description: string;
  bgClassName: string;
  image: StaticImageData;
  titleClassName: string;
  descriptionClassName: string;
  disabled?: boolean;
  path: string;
}

const ServiceCard = ({
  title,
  description,
  bgClassName,
  image,
  descriptionClassName,
  titleClassName,
  disabled,
  path,
}: ServiceDto) => {
  const router = useRouter();
  return (
    <div
      onClick={
        disabled
          ? undefined
          : () => {
              router.push(path);
            }
      }
      role="button"
      className={cn(
        "bg-no-repeat bg-cover p-2 pt-10 rounded-[20px] flex flex-col",
        bgClassName,
        disabled ? "opacity-50 !cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <Image
        className="ml-auto mb-2"
        src={image}
        width={148}
        height={164}
        alt=""
      />
      <div className="mt-auto">
        <p
          className={cn(
            "font-bold text-sm rounded-t-[12px] py-1 px-2 w-fit",
            titleClassName
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-xs text-txt-secondary p-2 rounded-b-[12px] rounded-tr-[12px]",
            descriptionClassName
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
