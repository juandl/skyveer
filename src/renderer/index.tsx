import { localStorageColorSchemeManager, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles.css";

//Components
import App from "./App";

//Config
import { theme } from "./config/theme";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "skyveer-color-scheme",
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <MantineProvider
    theme={theme}
    defaultColorScheme="auto"
    colorSchemeManager={colorSchemeManager}
  >
    <Notifications position="bottom-right" />
    <App />
  </MantineProvider>,
);
