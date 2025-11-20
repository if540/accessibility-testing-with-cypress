import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div className="container-fluid">
      <Header />
      <main role="main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
