import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Kdrama Evaluation</Link>

      <div>
        <Link to="/">Home</Link>
        <Link to="/dramas/add">Add Drama</Link>
      </div>
    </nav>
  );
}

export default Navbar;
