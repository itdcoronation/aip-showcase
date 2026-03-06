"use client";

import { MarketClosedSvg } from "@/assets/vectors";
import { WarningOctagonIcon } from "@/assets/vectors/icons";
import { useEffect, useMemo, useState } from "react";

interface MarketClosedBannerDto {
  addBreak?: boolean;
}

const WAT_TIMEZONE = "Africa/Lagos";
const OPEN_HOUR = 10;
const OPEN_MINUTE = 0;
const CLOSE_HOUR = 14;
const CLOSE_MINUTE = 30;

const getWatParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: WAT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value || "0";

  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    hour: Number(read("hour")),
    minute: Number(read("minute")),
    second: Number(read("second")),
    weekday: read("weekday"),
  };
};

const weekdayMap: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const toUtcFromWat = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0
) => {
  return Date.UTC(year, month - 1, day, hour - 1, minute, second);
};

const getNextOpenUtc = (now: Date) => {
  const current = getWatParts(now);
  const currentWeekday = weekdayMap[current.weekday] ?? 0;
  const nowUtc = now.getTime();

  const todayOpenUtc = toUtcFromWat(
    current.year,
    current.month,
    current.day,
    OPEN_HOUR,
    OPEN_MINUTE
  );
  const todayCloseUtc = toUtcFromWat(
    current.year,
    current.month,
    current.day,
    CLOSE_HOUR,
    CLOSE_MINUTE
  );

  const isWeekday = currentWeekday >= 1 && currentWeekday <= 5;
  const isBeforeOpen = nowUtc < todayOpenUtc;
  const isOpen = isWeekday && nowUtc >= todayOpenUtc && nowUtc < todayCloseUtc;

  if (isWeekday && isBeforeOpen) {
    return todayOpenUtc;
  }

  let daysToAdd = 1;
  if (!isWeekday) {
    daysToAdd = currentWeekday === 6 ? 2 : 1;
  } else if (isOpen) {
    daysToAdd = currentWeekday === 5 ? 3 : 1;
  } else {
    daysToAdd = currentWeekday === 5 ? 3 : 1;
  }

  const nextDateUtc = toUtcFromWat(
    current.year,
    current.month,
    current.day + daysToAdd,
    OPEN_HOUR,
    OPEN_MINUTE
  );

  return nextDateUtc;
};

const getCountdown = () => {
  const now = new Date();
  const nextOpenUtc = getNextOpenUtc(now);
  const remaining = Math.max(0, nextOpenUtc - now.getTime());

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

export const MarketClosedBanner = ({ addBreak }: MarketClosedBannerDto) => {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdownText = useMemo(() => {
    return `${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`;
  }, [countdown.hours, countdown.minutes, countdown.seconds]);

  return (
    <div className="bg-[#FFF3E6] border border-[#FFD8D0] flex items-start rounded-[12px] px-0 py-2 sm:p-2 gap-2">
      <WarningOctagonIcon className="min-w-[20px] ml-2 sm:ml-0" />
      <div className="">
        <p className="text-[#592E00] text-p3 sm:text-p2 font-semibold mb-0.5">
          Market closed
        </p>
        <p className="text-[#733A00] text-p4">
          The stock market is currently closed. Your pending orders will be
          fulfilled as soon as the market opens.{addBreak ? <br /> : null}{" "}
          Market opens in: {countdownText}
        </p>
      </div>

      <MarketClosedSvg className={addBreak ? "mr-2 ml-auto" : "mx-auto"} />
    </div>
  );
};
