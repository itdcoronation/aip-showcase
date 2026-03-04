import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      fill="#141415"
      d="M16.313 14.063a.563.563 0 0 1-1.125 0A6.195 6.195 0 0 0 9 7.875H3.608l2.415 2.415a.563.563 0 0 1-.796.796L1.852 7.71a.563.563 0 0 1 0-.795L5.227 3.54a.563.563 0 0 1 .796.795L3.608 6.75H9a7.32 7.32 0 0 1 7.313 7.313Z"
    />
  </svg>
)
export { SvgComponent as ArrowBendUpLeft }
