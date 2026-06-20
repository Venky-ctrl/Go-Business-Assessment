import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand-link" aria-label="Go to dashboard home">
        Go Business
      </Link>

      <nav aria-label="Primary">
        <Link to="/">Home</Link>
      </nav>

      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
