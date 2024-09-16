/* eslint-disable max-len */
export function ChartBubbleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)">
        <path
          d="M1.555 13.611a2.75 2.75 0 1 1 3.89-3.889 2.75 2.75 0 0 1-3.89 3.89Zm10.041 1.126a1.75 1.75 0 1 1 2.475-2.475 1.75 1.75 0 0 1-2.475 2.475ZM8.848 7.152a3.75 3.75 0 1 1 5.304-5.304 3.75 3.75 0 0 1-5.304 5.304Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h16v16H0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  )
}
