// Workaround for material-tailwind's broken TS types
// Their .d.ts incorrectly marks generic DOM props (placeholder, onPointerEnterCapture, etc.)
// as required instead of optional. Known issue: https://github.com/creativetimofficial/material-tailwind/issues/664
import {
    Navbar,
    Input,
    IconButton,
  } from "@material-tailwind/react";
  
  export const MTNavbar = Navbar as any;
  export const MTInput = Input as any;
  export const MTIconButton = IconButton as any;