"use client";
import { JSX, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AccountFullNameForm } from "./_components/full-name-form";
import { AccountAddressForm } from "./_components/address-form";
import { AccountEmailForm } from "./_components/email-form";
import { AccountPhoneNumberForm } from "./_components/phone-number-form";

const AccountUI = () => {
  const [tab, setTab] = useState("full-name");

  const tabs = [
    { id: "full-name", label: "Full Name" },
    { id: "address", label: "Address" },
    { id: "email", label: "Email" },
    { id: "phone-number", label: "Phone Number" },
  ];

  const Component: Record<string, JSX.Element> = {
    "full-name": <AccountFullNameForm />,
    address: <AccountAddressForm />,
    email: <AccountEmailForm />,
    "phone-number": <AccountPhoneNumberForm />,
  };

  return (
    <section className="grid md:grid-cols-[1fr_3fr] gap-6 md:gap-8 items-start">
      <div className="p-0.5 md:py-4 md:px-3 md:border border-[#EEEFF1] rounded-md bg-bg-secondary md:bg-white md:shadow-sm w-fit">
        <div className="hidden md:block">
          <p className="text-txt-primary mb-2 font-semibold text-sm">
            Update your personal information
          </p>
          <p className="text-txt-tertiary mb-4 text-xs">
            A signed document reflecting your investment, suitable for
            submission to any embassy
          </p>
        </div>
        <RadioGroup
          value={tab}
          defaultValue={"full-name"}
          onValueChange={(value) => setTab(value)} // Update tab on change
          className="flex md:flex-col md:gap-4 whitespace-nowrap"
        >
          {tabs.map(({ id, label }) => (
            <button
              className={cn(
                "flex items-center gap-4 py-1 md:py-2 px-3 md:px-4 rounded-[6px]",
                id === tab ? "bg-white md:bg-bg-secondary" : ""
              )}
              key={id}
            >
              <RadioGroupItem
                onClick={() => setTab(id)}
                value={id}
                id={id}
                className={cn(
                  "bg-white border-5 w-5 h-5 hidden md:inline-flex",
                  id === tab ? "border-bg-brand" : "border-bg-secondary"
                )}
                iconClassName="hidden"
              />
              <Label
                className={cn(
                  "text-xs md:text-p3 font-medium",
                  id === tab ? "text-txt-primary" : "text-txt-secondary"
                )}
                htmlFor={id}
              >
                {label}
              </Label>
            </button>
          ))}
        </RadioGroup>
      </div>
      <div>{Component[tab]}</div>
    </section>
  );
};

export { AccountUI };
