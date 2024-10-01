import React from 'react';

interface DiagonalUpArrowIconProps {
  color: string;
  size?: number;
}

const DiagonalUpArrowIcon: React.FC<DiagonalUpArrowIconProps> = ({ color, size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 17L17 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17V7H10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DiagonalUpArrowIcon;
