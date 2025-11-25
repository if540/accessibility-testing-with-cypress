import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect } from "react";

function MainLayout() {

  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <div>
        <header>
          <Header />
        </header>
        <main role="main" className="grid grid-cols-12 container mx-auto">
          <Outlet />
        </main>
      </div>
      {ready && <div data-app-ready />}
    </>
  );
}

export default MainLayout;
