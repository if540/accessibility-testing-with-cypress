import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from "./layouts/MainLayout";
import HomeIndex from "./pages/home";
import ExampleIndex from "./pages/example";
import ExampleAbout from "./pages/example/about";
import SiteIndex from "./pages/site";
import SiteReport from "./pages/site/report";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeIndex />} />
              <Route path="/site/:siteName" element={<SiteIndex />} />
              <Route path="/site/:siteName/:reportId" element={<SiteReport />} />
              <Route path="/example">
                <Route index element={<ExampleIndex />} />
                <Route path="about" element={<ExampleAbout />} />
              </Route>
            </Route>
            </Routes>
          </HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
