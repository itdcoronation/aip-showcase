import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#56575D"
      d="M10 1.875A8.125 8.125 0 1 0 18.125 10 8.133 8.133 0 0 0 10 1.875ZM5.787 15.43a5 5 0 0 1 8.425 0 6.862 6.862 0 0 1-8.425 0ZM7.5 9.375a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm7.637 5.188a6.223 6.223 0 0 0-2.817-2.246 3.75 3.75 0 1 0-4.64 0 6.223 6.223 0 0 0-2.817 2.246 6.875 6.875 0 1 1 10.274 0Z"
    />
  </svg>
)
export { SvgComponent as UserCircleIcon }