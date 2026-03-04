import { MailIcon, PhoneOutgoingIcon } from "lucide-react";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedInLogo,
  TwitterLogo,
  //WhatsappLogo,
} from "@/assets/vectors/icons";
const Socials = () => {
  return (
    <>
      <section className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-full max-w-xl flex flex-col gap-4">
        <div className="">
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Our socials
          </p>
          <div className="flex gap-2">
            <a
              href="https://www.linkedin.com/company/coronationgroup?originalSubdomain=ng"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <LinkedInLogo />
              </div>
            </a>
            <a href="https://www.instagram.com/coronationgroup/" target="_blank" rel="noopener noreferrer">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <InstagramLogo />
              </div>
            </a>
            {/* <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
              <WhatsappLogo />
            </div> */}
            <a href="https://web.facebook.com/coronationnggroup?_rdc=2&_rdr#" target="_blank" rel="noopener noreferrer">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <FacebookLogo />
              </div>
            </a>
            <a href="https://x.com/coronation_ng" target="_blank" rel="noopener noreferrer">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <TwitterLogo />
              </div>
            </a>
          </div>
        </div>
        <div>
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Phone or email us
          </p>
          {/* <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <MailIcon size={16} strokeWidth={1.5} />
              </div>
              <p>info@coronationwealth.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <PhoneOutgoingIcon size={16} strokeWidth={1.5} />
              </div>
              <p>+234 803 CORONATION</p>
            </div>
          </div> */}
        </div>
        <div>
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Mutual funds
          </p>
          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <MailIcon size={16} strokeWidth={1.5} />
              </div>
              <p>crc@coronationam.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <PhoneOutgoingIcon size={16} strokeWidth={1.5} />
              </div>
              <p>0201-2272567-69</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Equities
          </p>
          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <MailIcon size={16} strokeWidth={1.5} />
              </div>
              <p>crc@coronationsl.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <PhoneOutgoingIcon size={16} strokeWidth={1.5} />
              </div>
              <p>0201-2272571-73</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Trust Services
          </p>
          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <MailIcon size={16} strokeWidth={1.5} />
              </div>
              <p>crc@coronationnt.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <PhoneOutgoingIcon size={16} strokeWidth={1.5} />
              </div>
              <p>0201-227 1720</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-p3 text-txt-primary font-semibold mb-2">
            Fixed Income
          </p>
          <div className="grid grid-cols-[1.5fr_1fr] gap-2">
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <MailIcon size={16} strokeWidth={1.5} />
              </div>
              <p>coronationsecuritiesfidesk@coronationsl.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-stroke-primary rounded-sm w-[28px] h-[28px] flex items-center justify-center">
                <PhoneOutgoingIcon size={16} strokeWidth={1.5} />
              </div>
              <p>0201-2272571-73</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { Socials };
