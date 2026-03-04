import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={47}
    height={46}
    viewBox="0 0 47 46"
    fill="none"
    {...props}
  >
    <rect width={40} height={40} x={3.5} y={3} fill="#E8D8F1" rx={20} />
    <rect
      width={40}
      height={40}
      x={3.5}
      y={3}
      stroke="#F8F2FA"
      strokeWidth={6}
      rx={20}
    />
    <g clipPath="url(#a)">
      <path
        stroke="#88609D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M26.833 26.333 23.5 23m0 0-3.333 3.333M23.5 23v7.5m6.992-2.175A4.167 4.167 0 0 0 28.5 20.5h-1.05A6.668 6.668 0 1 0 16 26.583"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M13.5 13h20v20h-20z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as CloudUploadIcon }
