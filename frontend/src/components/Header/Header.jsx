import { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import Leaderboard from '../../pages/Leaderboard/Leaderboard';

function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('john_doe'); 

    let userLink;
    if (isLoggedIn) {
        userLink = { href: `/${username}`, text: "Profile Page"};
    } else {
        userLink = { href: "/login", text: "Log In"};
    }

    return (
        <div id="header">
            <nav>
                <Link to="/" className="header-link">Home</Link>
                <Link to="/champions" className="header-link">Champions</Link>
                <Link to="/leaderboard" className="header-link">Leaderboard</Link>
                <Link to="/statistics" className="header-link">Statistics</Link>
                <Link to="/queue_types" className="header-link">Queue Types</Link>
            </nav>
            <div id="user-page">
                <img src="/imgs/profile-photo.png" alt="Logo" className="profile-image" />
                <Link to={userLink.href} className="user-link">{userLink.text}</Link>
            </div>
        </div>
    )
}

export default Header;