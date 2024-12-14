import { useState } from 'react'
import './header.css'

function Header() {
    return (
        <div id="header">
            <nav>
                <a href="/" className="Header Link">Home</a>
                <a href="/champions" className="Header Link">Champions</a>
                <a href="/leaderboard" className="Header Link">Leaderboard</a>
                <a href="/statistics" className="Header Link">Statistics</a>
                <a href="/queue_types" className="Header Link">Queue Types</a>
            </nav>
            <a href="/user" className="Header Link">User Page Placeholder</a>
        </div>
    )
}

export default Header;