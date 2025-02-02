import { Link } from "react-router-dom";
import "./Topbar.css";

export default function TopBar() {
  return (
    <div className="top">
      <div className="topLeft">
        <i className="fa-solid fa-book-open"></i>
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              HOME
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/product">
              ADMIN
            </Link>
          </li>
        </ul>
      </div>

      <div className="topRight">
        <Link to="/cart">
          <i className="fa-solid fa-cart-shopping" style={{ cursor: "pointer", fontSize: "24px" }}></i>
        </Link>
      </div>  
    </div>
  );
}