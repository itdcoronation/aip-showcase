"use client";
import { checkImg } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import useOnboardingStore from "@/store/onboarding";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OnboardingSuccessUI = () => {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();
  return (
    <main className="flex items-center justify-center bg-neutral-800/16 min-h-dvh">
      <section className="bg-white w-full max-w-[500px] rounded-[12px] px-4 py-16 text-center flex flex-col items-center justify-center gap-12">
        <Image width={229} height={232} src={checkImg} alt="check mark" />
        <div>
          <h1 className="text-h3 font-semibold text-txt-primary mb-2">
            Hurray! 🎉
          </h1>
          <p className="text-p3 text-txt-secondary max-w-[350px]">
            You have successfully completed your onboarding with Coronation. You
            can now enjoy the full services of our platform. See you at the top!
          </p>
        </div>
        <Button
          className="max-w-[350px] w-full"
          onClick={() => {
            router.push(`${ROUTES.overview}?feedback=true`);
            resetOnboarding();
          }}
        >
          Continue to dashboard
        </Button>
      </section>
    </main>
  );
};

export { OnboardingSuccessUI };
