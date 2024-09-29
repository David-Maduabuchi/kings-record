import { createRef } from "react";

export const sidebarRef = createRef<HTMLDivElement>();
export const toggleButtonRef = createRef<HTMLDivElement>();

export function getFormattedDate() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const today = new Date();
  const dayName = days[today.getDay()]; // Get the day name
  const day = today.getDate(); // Get the day number
  const month = months[today.getMonth()]; // Get the month abbreviation
  const year = today.getFullYear(); // Get the year

  return `${dayName} ${day} ${month}, ${year}`;
}

// utils.ts

export const smoothScrollTo = (element: HTMLElement, duration: number) => {
  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

//restructuring received data for the spreadsheet
interface FormDataToSend {
  total: number;
  title: string;
  firstName: string;
  lastName: string;
  Date: string;
  email: string;
  phoneNumber: string;
  partnerships: {
    type: string;
    amount: number;
  }[];
  givings: {
    type: string;
    amount: number;
  }[];
}

export interface TransformedData {
  title: string;
  firstName: string;
  lastName: string;
  Date: string;
  email: string;
  phoneNumber: string;
  partnershipsTotal: number;
  givingsTotal: number;
  total: number;
}

export const transformThisData = (
  data: FormDataToSend[]
): TransformedData[] => {
  return data.map((entry) => {
    // Calculate total partnerships amount
    const partnershipsTotal = entry.partnerships.reduce(
      (acc, partnership) => acc + partnership.amount,
      0
    );

    // Calculate total givings amount
    const givingsTotal = entry.givings.reduce(
      (acc, giving) => acc + giving.amount,
      0
    );

    return {
      title: entry.title,
      firstName: entry.firstName,
      lastName: entry.lastName,
      Date: entry.Date,
      email: entry.email,
      phoneNumber: entry.phoneNumber,
      partnershipsTotal: partnershipsTotal,
      givingsTotal: givingsTotal,
      total: partnershipsTotal + givingsTotal,
    };
  });
};



export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters (if the input might have them)
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format the number as 0813-443-1286
  const formatted = cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');

  return formatted;
};