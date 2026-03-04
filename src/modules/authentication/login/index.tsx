"use client";
import React from "react";
import { Logo } from "@/assets/vectors";
import { LoginForm } from "./_components/login-form";
import Image from "next/image";
import { loginImg, logoWhiteImg } from "@/assets/images";

const LoginUI: React.FC = () => {
  return (
    <main className="grid p-0 md:p-3 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_1.5fr] min-h-[100dvh] gap-4">
      <section
        className={
          "bg-[url('/login-bg.png')] bg-cover bg-no-repeat rounded-lg px-4 lg:px-8 py-8 hidden md:flex"
        }
      >
        <div className="mt-auto grid gap-3" >
          <Image
            src={logoWhiteImg}
            width={147}
            height={16}
            alt="Coronation logo"
            className="mb-3"
          />
          <p className="text-h3 text-txt-primary-inv" >
            Unlock Effortless Wealth-Building with Coronation Wealth Hub
          </p>
          <p className="text-p3 text-txt-tertiary" >
            Join a group of smart investors who trust Coronation to help turn their funds
            into a step towards financial freedom. We provide the performance, security, and
            personalized support you need, so you can relax, watch your wealth grow, and 
            focus on living the life you have worked for. 
          </p>
        </div>
      </section>
      <section className="py-8 sm:py-10 overflow-hidden grid">
        <Logo id="logo" className="mb-12 md:mb-14 block md:hidden ml-4" />
        <LoginForm />
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

export { LoginUI };
