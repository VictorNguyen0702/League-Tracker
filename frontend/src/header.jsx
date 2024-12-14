import { useState } from 'react'
import './header.css'

function Header() {
    return (
        <nav>
            <a href="/">Home</a>
            <a href="/champions">Champions</a>
            <a href="/leaderboard">Leaderboard</a>
            <a href="/statistics">Statistics</a>
            <a href="/queue_types">Queue Types</a>
        </nav>
    )
}

export default Header;