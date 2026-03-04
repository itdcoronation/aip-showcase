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
      d="M18.75 16.25H17.5V7.5a1.25 1.25 0 0 0-1.25-1.25h-5V2.5a1.25 1.25 0 0 0-1.944-1.04l-6.25 4.165A1.25 1.25 0 0 0 2.5 6.667v9.583H1.25a.625.625 0 1 0 0 1.25h17.5a.625.625 0 0 0 0-1.25Zm-2.5-8.75v8.75h-5V7.5h5Zm-12.5-.833L10 2.5v13.75H3.75V6.667Zm5 2.083V10a.625.625 0 0 1-1.25 0V8.75a.625.625 0 0 1 1.25 0Zm-2.5 0V10A.625.625 0 0 1 5 10V8.75a.625.625 0 0 1 1.25 0Zm0 4.375v1.25a.625.625 0 0 1-1.25 0v-1.25a.625.625 0 1 1 1.25 0Zm2.5 0v1.25a.625.625 0 0 1-1.25 0v-1.25a.625.625 0 1 1 1.25 0Z"
    />
  </svg>
)
export { SvgComponent as BuildingsIcon }
