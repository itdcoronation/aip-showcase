"use client";
import { Assets } from "./_components/assets";
import { Trustees } from "../recommended-products/_components/trustees";

const TrusteesUI = () => {
  return (
    <>
      <section className="grid gap-12">
        <Trustees title="Subscribe into our offerings" />
        <Assets />
      </section>
    </>
  );
};

export { TrusteesUI };
export * from "./comprehensive-will";
export * from "./simple-will";
export * from "./private-trust";
