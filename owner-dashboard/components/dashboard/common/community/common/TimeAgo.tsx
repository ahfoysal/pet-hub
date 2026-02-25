"use client";

import React, { useEffect, useState } from "react";

interface TimeAgoProps {
  date: string | Date;
  className?: string;
  updateInterval?: number; // in milliseconds
}

export function TimeAgo({
  date,
  className = "",
  updateInterval = 60000, // Update every minute by default
}: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState("");

  const calculateTimeAgo = (dateInput: string | Date): string => {
    const now = new Date();
    const past = new Date(dateInput);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 5) {
      return "Just now";
    }
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w`;
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}y`;
  };

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(date));

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(date));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return (
    <span className={`text-gray-500 text-sm ${className}`}>
      {timeAgo}
    </span>
  );
}

export default TimeAgo;
