import "@material-tailwind/react";

declare module "@material-tailwind/react" {
  export interface CommonProps {
    placeholder?: string;
    onPointerEnterCapture?: any;
    onPointerLeaveCapture?: any;
    onResize?: any;
    onResizeCapture?: any;
    crossOrigin?: any;
  }
}