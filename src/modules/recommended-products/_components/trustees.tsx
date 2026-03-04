import { TrusteeCardData, TrusteesCard } from "@/components/cards/trustee-card";

const trustees: TrusteeCardData[] = [
  {
    title: "Simple Will",
    description: "Write a better description for this section",
    link: "/trustees/simple-will",
    image: "/trustee-card-bg.png",
  },
  {
    title: "Private Trust",
    description: "Write a better description for this section",
    link: "/trustees/private-trust",
      image: "/private-trust-bg.png",
  },
  {
    title: "Comprehensive Will",
    description: "Write a better description for this section",
    link: "/trustees/comprehensive-will",
      image: "/comprehensive-will-bg.png",
  },
];

export const Trustees = ({ title }: { title?: string }) => {
  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            {title ?? "Trustees"}
          </p>
          <p className="text-p4 text-txt-secondary">
            Write a better description for this section{" "}
          </p>
        </div>
      </div>

     <div className="overflow-auto" >
       <div className="flex gap-4 min-w-[900px] w-full pb-2">
        {trustees.map((item) => (
          <TrusteesCard {...item} key={item.title} />
        ))}
      </div>
     </div>
    </section>
  );
};
