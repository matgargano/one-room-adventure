import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Window from "./Window.tsx";
import "./index.css";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import "animate.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="main-container relative">
        <Window />
        <App />
      </div>
    </Provider>
  </StrictMode>
);
