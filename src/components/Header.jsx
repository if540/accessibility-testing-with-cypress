import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              width="30"
              height="30"
              className="me-2"
            />
            無障礙網站測試
          </Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/example">錯誤範例</Link>
          </div>
        </div>
      </nav>
  );
}

export default Header;