"use client";
import React from "react";
import { Logo } from "@/assets/vectors";
import Image from "next/image";
import { loginImg } from "@/assets/images";
import { NewPasswordForm } from "./_components/new-password-form";

const NewPasswordUI: React.FC = () => {
  return (
    <main className="grid p-0 md:p-3 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_1.5fr] min-h-[100dvh] gap-4">
      <section className={"bg-[#F8F2FA] rounded-lg px-12 py-8 hidden md:block"}>
        <Logo className="mb-14" />
        <Image
          src={loginImg}
          width={563}
          height={664}
          alt="Pillars and coins"
        />
      </section>
      <section className="py-8 sm:py-10 overflow-hidden grid">
        <Logo id="logo" className="mb-12 md:mb-14 block md:hidden ml-4" />
        <NewPasswordForm />
        <Image
          src={loginImg}
          width={563}
          height={664}
          alt="Pillars and coins"
          className="-mb-[180px] w-full max-w-[500px] mt-[20px] mx-auto block md:hidden"
        />
      </section>
    </main>
  );
};

export { NewPasswordUI };
