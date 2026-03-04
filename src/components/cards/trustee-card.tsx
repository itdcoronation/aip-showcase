import Link from "next/link";

export interface TrusteeCardData {
  title: string;
  description: string;
  link: string;
  image: string;
}
export const TrusteesCard = ({
  title,
  description,
  link,
  image,
}: TrusteeCardData) => {
  return (
    <Link href={link} className="p-1 border rounded-[20px] w-[300px]">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="rounded-[20px] p-1 pt-44 bg-[#6E338C4D] bg-cover bg-center"
      >
        <div
          className="bg-[#0000003D] backdrop-blur-sm rounded-[20px] p-2 text-white"
          style={{}}
        >
          <p className="text-txt-primary-inverse text-p3 font-semibold">
            {title}
          </p>
          <p className="mb-10 text-p1 text-xs">{description}</p>
        </div>
      </div>
    </Link>
  );
};
