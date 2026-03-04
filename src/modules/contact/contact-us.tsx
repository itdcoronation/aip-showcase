"use client";
import { ContactForm } from "./_components/contact-form";
import { Socials } from "./_components/socials";

const ContactUsUI = () => {
  return (
    <>
      <section className="px-6 py-4">
        <header className="mb-8">
          <h1 className="text-p1 font-semibold">Contact us</h1>
        </header>
        <section className="grid md:flex gap-4">
          <ContactForm />
          <Socials />
        </section>
      </section>
    </>
  );
};

export { ContactUsUI };
