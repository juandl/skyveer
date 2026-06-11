import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Deep navy palette inspired by the Skyveer icon.
// Index 0 = lightest (text on dark bg), index 9 = darkest.
// Mantine maps: dark[4]=borders, dark[5]=hover, dark[6]=cards/inputs, dark[7]=body bg.
const navy: MantineColorsTuple = [
  "#c8cee0", // text
  "#8a95ad",
  "#5c6885",
  "#344166",
  "#243154", // borders — muted, close to body
  "#1a274a", // hover
  "#131e3a", // paper / inputs
  "#0c1832", // body background
  "#070f22",
  "#030714",
];

export const theme = createTheme({
  primaryColor: "blue",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  defaultRadius: "md",
  colors: {
    dark: navy,
  },
});
