import { createRoot } from "react-dom/client";

import "@/styles/app.css";
import { BrowserRouter } from "react-router";
import Router from "./router";
import { ConfigProvider } from "./contexts/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import store from "./store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <ConfigProvider>
            <Router />
          </ConfigProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);
