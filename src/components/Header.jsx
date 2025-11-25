import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="col-span-1 p-4 flex justify-between items-center max-auto">
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-base font-bold">無障礙網站測試</h1>
      </Link>
      <Link to="/example">錯誤範例</Link>
    </nav>
  );
}

export default Header;