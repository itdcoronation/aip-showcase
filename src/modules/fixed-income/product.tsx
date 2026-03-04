"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Collapsible } from "@/components/collapsible";
import { Notice } from "@/components/notice";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";

const FixedIncomeProductUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought");

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="mx-auto max-w-[940px] mt-8 grid gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-bg-[#FFEBCC] w-[44px] h-[44px] sm:w-[58px] sm:h-[58px] rounded-full flex">
            <Image
              className="m-auto w-[44px] h-[44px] sm:w-[58px] sm:h-[58px]"
              src={mutualFundLogo}
              width={32}
              height={34}
              alt="logo"
            />
          </div>
          <div>
            <p className="text-txt-primary font-semibold text-sm sm:text-h4 mb-1">
              Federal Government Treasury Bill 2025
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Rate: 24.76%
            </p>
          </div>
          <div className="flex gap-2 ml-auto w-full sm:w-fit">
            {bought ? (
              <>
                <Button
                  onClick={() => router.push(`/fixed-income/${id}/invest`)}
                  size={"m"}
                  variant={"secondary"}
                >
                  Top up
                  <PlusCircle />
                </Button>
                <Button
                  onClick={() => router.push(`/fixed-income/${id}/withdraw`)}
                  size={"m"}
                >
                  Withdraw
                  <TrendingUp />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push(`/fixed-income/${id}/invest`)}
                size={"m"}
              >
                Invest
                <TrendingUp />
              </Button>
            )}
          </div>
        </div>
        {bought ? (
          <div className="flex-col sm:flex-row flex gap-2 justify-between items-start">
            <div className="grid gap-1">
              <p className="text-xs text-txt-secondary">Current value</p>
              <p className="text-h2 text-[var(--purple-700)] font-semibold">
                ₦400,000,000.00
              </p>
              <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
                <ArrowElbowRightIcon /> 0%
              </span>
            </div>
            <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Amount invested</p>
              <p className="text-h2 text-[var(--purple-700)] font-semibold">
                ₦400,000,000.00
              </p>
            </div>
            <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Total gain/loss</p>
              <p className="text-h2 text-txt-success font-semibold">
                ₦400,000,000.00
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:hidden border-t border-t-stroke-primary w-full pt-6 mt-4">
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Amount invested</p>
                <p className="text-p1 sm:text-h2 text-[var(--purple-700)] font-semibold">
                  ₦400,000,000.00
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Total gain/loss</p>
                <p className="text-p1 sm:text-h2 text-txt-success font-semibold">
                  ₦400,000,000.00
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Collapsible
            title="About Treasury Bills"
            body={
              <p className="text-p4 text-txt-secondary max-w-[760px]">
                Lorem ipsum dolor sit amet consectetur. Ultrices mattis suscipit
                facilisis scelerisque. Lacus donec neque lacus eget id cursus
                feugiat eget est. Aliquam consequat eu quam placerat consectetur
                elit vel faucibus bibendum. Lobortis nunc pretium facilisi nisl
                duis eu velit. Nunc dolor urna semper et molestie sit diam.
                Vitae nisi tempus eget volutpat sed lacus. Mollis consectetur
                est enim enim feugiat.
              </p>
            }
          />
        )}

        {bought ? (
          <>
            <PurchasedDetails />
            <Notice
              title="Important"
              description="Please note that subscription made after 12pm will be applied in the next working day"
            />
          </>
        ) : (
          <Details />
        )}
      </section>
    </>
  );
};

const Details = () => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Details</p>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Risk level</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Rate</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Yield</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Tenure</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Last coupon amount</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Maturity date</p> <p>11,020,084</p>
      </div>
    </div>
  );
};

const PurchasedDetails = () => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Date purchased</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Maturity date</p> <p>11,020,084</p>
      </div>
    </div>
  );
};

export { FixedIncomeProductUI };
