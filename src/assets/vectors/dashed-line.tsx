import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={2}
    height={52}
    fill="none"
    {...props}
  >
    <path
      stroke="#B5B6BA"
      strokeDasharray="5 5"
      strokeLinejoin="bevel"
      d="M1 0v52"
    />
  </svg>
)
export { SvgComponent as DashedLine }
