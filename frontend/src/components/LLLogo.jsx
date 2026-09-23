import React from 'react';

const LLLogo = ({ size = 40, borderRadius = 10 }) => {
  const rx = (borderRadius / size) * 100;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Purple background */}
      <rect width="100" height="100" rx={rx} ry={rx} fill="#6b46c1" />

      {/* Left "l" — vertical, curves out to the bottom-left */}
      <path
        d="M 32,14 L 32,62 Q 32,84 14,84"
        fill="none"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right "l" — vertical, curves out to the bottom-right */}
      <path
        d="M 60,14 L 60,62 Q 60,84 78,84"
        fill="none"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LLLogo;
