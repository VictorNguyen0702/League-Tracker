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
            <form>
                <select>
                    <option value="">North America (NA)</option>
                    <option value="">Europe West (EUW)</option>
                    <option value="">Europe Nordic & East (EUNE)</option>
                    <option value="">Oceania (OCE)</option>
                    <option value="">Russia (RU)</option>
                    <option value="">Turkey (TR)</option>
                    <option value="">Brazil (BR)</option>
                    <option value="">Latin America North (LAN)</option>
                    <option value="">Latin America South (LAS)</option>
                    <option value="">Japan (JP)</option>
                    <option value="">Taiwan (TW)</option>
                    <option value="">Singapore (SG)</option>
                    <option value="">Thailand (TH)</option>
                    <option value="">Philippines (PH)</option>
                    <option value="">Middle East (ME)</option>
                </select>
                <input type="text" name="username" placeholder="Enter username"></input>
            </form>
            <a href = "/user">Log In</a>
        </nav>
    )
}

export default Header;