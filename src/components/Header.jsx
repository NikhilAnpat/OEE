import "./Header.css";
import expand from "../assets/expand.png";
import notification from "../assets/notification.png";
import profile from "../assets/user.png";

function Header({ isNavOpen, setIsNavOpen }) {
  const toggle = () => setIsNavOpen((prev) => !prev);

  return (
    <header className="header">
      <div className="header-left">
        <button
          className={`nav-toggle ${isNavOpen ? "open" : ""}`}
          onClick={toggle}
          aria-label={isNavOpen ? "Close navigation" : "Open navigation"}
        >
          {isNavOpen ? "✕" : "☰"}
        </button>

        <span className="header-text">Demo</span>
      </div>


      <div className="header-right">
        <span className="icon">
          <img src={expand} alt="Expand" />
        </span>

        <span className="icon">
          <img src={notification} alt="Notification" />
        </span>
        <span className="icon" >
          TASK
        </span>
        <span className="icon">
          <img src={profile} alt="Profile" />
        </span>
      </div>
    </header>
  );
}

export default Header;
