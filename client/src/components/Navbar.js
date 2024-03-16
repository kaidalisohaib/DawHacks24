import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import home from '../img/home.png';
import doorKey from '../img/door-key.png';
import user from '../img/user.png';
import aboutUs from '../img/about-us.png';

function TopNavbar({isLoggedIn}) {
  return (
    <div className="navbar">
      <Link to="/">
        <div className="navbar-item">
          <img src={home} alt="home"/>
          Main page
        </div>
      </Link>
      <Link to="/about-us">
        <div className="navbar-item">
          <img src={aboutUs} alt="about-us"/>
          About us
        </div>
      </Link>
      {/** if logged in, show profile, if not, show login */}
      {isLoggedIn ? <Link to="/profile">
        <div className="navbar-item">
          <img src={user} alt="profile"/>
          Profile
        </div>
      </Link> : <Link to="/login">
        <div className="navbar-item">
          <img src={doorKey} alt="login"/>
          Login
        </div>
      </Link>}
    </div>
  );
}

export default TopNavbar;