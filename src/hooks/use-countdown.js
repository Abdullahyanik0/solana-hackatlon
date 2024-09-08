import { useState, useEffect } from "react";

const useCountdown = (targetDate) => {
  const calculateTimeLeft = (targetDate) => {
    const now = new Date();
    const endDate = new Date(targetDate);
    const difference = endDate - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = calculateTimeLeft(targetDate);
      setTimeLeft(time);
      if (time.days == 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
    isFinish: isExpired,
  };
};

export default useCountdown;
