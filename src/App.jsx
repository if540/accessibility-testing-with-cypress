import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import HomeIndex from "./pages/home";
import ExampleIndex from "./pages/example";
import ExampleAbout from "./pages/example/about";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeIndex />} />
          <Route path="/test" element={<ExampleAbout />} />

          <Route path="/example">
            <Route index element={<ExampleIndex />} />
            <Route path="about" element={<ExampleAbout />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
