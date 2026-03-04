import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    {...props}
  >
    <rect width={32} height={32} x={2} y={2} fill="#E8D8F1" rx={16} />
    <rect
      width={32}
      height={32}
      x={2}
      y={2}
      stroke="#FEF3FC"
      strokeWidth={4}
      rx={16}
    />
    <path
      fill="#88609D"
      d="m23.354 15.146-3.5-3.5a.5.5 0 0 0-.354-.146h-6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-8a.499.499 0 0 0-.146-.354ZM20 13.206 21.793 15H20v-1.793ZM22.5 23.5h-9v-11H19v3a.5.5 0 0 0 .5.5h3v7.5Z"
    />
  </svg>
)
export { SvgComponent as FileIcon }
