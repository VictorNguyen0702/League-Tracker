import Header from "../../components/Header/Header.jsx";
import React, { useState } from 'react';

function Leaderboard() {
    const [filters, setFilters] = useState({
        region: '',
        queue: '',
        tier: '',
        division: ''
    });

    const changeFilter = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };
    return (
        <div id="leaderboard-container">
            <div id="filters">
                <h2> Rank Filters</h2>
                <form>
                    <div className="filter-group">
                        <label htmlFor="region">Region</label>
                        <select id="region" name="region" value={filters.region} onChange={changeFilter}>
                            <option value="NA">North America (NA)</option>
                            <option value="EUW">Europe West (EUW)</option>
                            <option value="EUNE">Europe Nordic & East (EUNE)</option>
                            <option value="OCE">Oceania (OCE)</option>
                            <option value="RU">Russia (RU)</option>
                            <option value="TR">Turkey (TR)</option>
                            <option value="BR">Brazil (BR)</option>
                            <option value="LAN">Latin America North (LAN)</option>
                            <option value="">Latin America South (LAS)</option>
                            <option value="">Japan (JP)</option>
                            <option value="">Taiwan (TW)</option>
                            <option value="">Singapore (SG)</option>
                            <option value="">Thailand (TH)</option>
                            <option value="">Philippines (PH)</option>
                            <option value="">Middle East (ME)</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="queue-type">Queue</label>
                        <select id="queue" name="queue" value={filters.queue} onChange={changeFilter}>
                            <option value="solo">Ranked Solo/Duo</option>
                            <option value="flex">Ranked Flex</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="tier">Tier</label>
                        <select id="tier" name="tier" value={filters.tier} onChange={changeFilter}>
                            <option value="iron">Iron</option>
                            <option value="bronze">Bronze</option>
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="platinum">Platinum</option>
                            <option value="emerald">Emerald</option>
                            <option value="diamond">Diamond</option>
                            <option value="master">Master</option>
                            <option value="grandmaster">Grandmaster</option>
                            <option value="challenger">Challenger</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="region">Division</label>
                        <select id="division" name="division" value={filters.division} onChange={changeFilter}>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </div>
                </form>
            </div>
            <div id="user-list">

            </div>
        </div>
    )
}

export default Leaderboard;