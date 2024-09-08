import { useState, useEffect } from "react";

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  function getTimeLeft(targetDate) {
    const now = new Date();
    const endDate = new Date(targetDate);
    const difference = endDate - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }

  function formatTimeUnit(value) {
    const formatValue = value.toString().padStart(2, "0");
    return Number(formatValue);
  }

  return {
    days: formatTimeUnit(timeLeft.days),
    hours: formatTimeUnit(timeLeft.hours),
    minutes: formatTimeUnit(timeLeft.minutes),
    seconds: formatTimeUnit(timeLeft.seconds),
  };
};

export default useCountdown;
