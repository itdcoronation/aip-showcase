import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fill="#88609D"
      d="m14.207 4.586-2.793-2.793a1 1 0 0 0-1.414 0L2.293 9.5a.991.991 0 0 0-.293.707V13a1 1 0 0 0 1 1h2.793a.992.992 0 0 0 .707-.293L14.207 6a1 1 0 0 0 0-1.414Zm-11 5.415 5.647-5.647 1.042 1.043-5.646 5.646-1.043-1.042ZM3 11.207 4.793 13H3v-1.793Zm3 1.587L4.957 11.75l5.647-5.647 1.042 1.043L6 12.794Z"
    />
  </svg>
)
export { SvgComponent as PencilIcon }
