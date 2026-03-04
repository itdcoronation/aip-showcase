import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#56575D"
      d="M12.5 1.25a6.255 6.255 0 0 0-5.945 8.186l-4.497 4.497a.625.625 0 0 0-.183.442V17.5a.625.625 0 0 0 .625.625h3.125a.625.625 0 0 0 .625-.625v-1.25H7.5a.625.625 0 0 0 .625-.625v-1.25h1.25a.624.624 0 0 0 .442-.183l.747-.748A6.25 6.25 0 1 0 12.5 1.25Zm0 11.25a4.977 4.977 0 0 1-1.848-.352.624.624 0 0 0-.69.13l-.846.847H7.5a.625.625 0 0 0-.625.625V15h-1.25a.625.625 0 0 0-.625.625v1.25H3.125v-2.241l4.596-4.596a.625.625 0 0 0 .131-.69A5 5 0 1 1 12.5 12.5ZM15 5.937a.938.938 0 1 1-1.875 0 .938.938 0 0 1 1.875 0Z"
    />
  </svg>
)
export { SvgComponent as KeyIcon }
