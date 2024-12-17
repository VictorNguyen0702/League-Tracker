import { useState } from 'react'
import './Header.css'

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
                <a href="/" className="header-link">Home</a>
                <a href="/champions" className="header-link">Champions</a>
                <a href="/leaderboard" className="header-link">Leaderboard</a>
                <a href="/statistics" className="header-link">Statistics</a>
                <a href="/queue_types" className="header-link">Queue Types</a>
            </nav>
            <div id="user-page">
                <img src="/imgs/profile-photo.png" alt="Logo" className="profile-image" />
                <a href={userLink.href} className="user-link">{userLink.text}</a>
            </div>
        </div>
    )
}

export default Header;