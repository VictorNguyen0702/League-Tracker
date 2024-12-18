import React, { useState, useEffect} from 'react';
import axios from 'axios';

function Leaderboard() {

    const [filters, setFilters] = useState({
        region: '',
        queue: '',
        tier: '',
        division: ''
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const changeFilter = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    useEffect(() => {
        const { region, queue, tier, division } = filters;
        if (region === "" || queue === ""  || tier === ""  || division === "" ) {
            setData([]);
            setLastUpdated(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/leaderboard/${filters.region}/${filters.queue}/${filters.tier}/${filters.division}`)
            .then((response) => {

                setData(response.data.users);
                setLastUpdated(response.data.last_updated);         
                })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [filters]);


    return (
        <div id="leaderboard-container">
            <div id="filters">
                <h2> Rank Filters</h2>
                <form>
                    <div className="filter-group">
                        <label htmlFor="region">Region</label>
                        <select id="region" name="region" value={filters.region} onChange={changeFilter}>
                            <option value=""></option>
                            <option value="NA">North America (NA)</option>
                            <option value="EUW">Europe West (EUW)</option>
                            <option value="EUNE">Europe Nordic & East (EUNE)</option>
                            <option value="OCE">Oceania (OCE)</option>
                            <option value="RU">Russia (RU)</option>
                            <option value="TR">Turkey (TR)</option>
                            <option value="BR">Brazil (BR)</option>
                            <option value="LAN">Latin America North (LAN)</option>
                            <option value="LAS">Latin America South (LAS)</option>
                            <option value="JP">Japan (JP)</option>
                            <option value="TW">Taiwan (TW)</option>
                            <option value="SG">Singapore (SG)</option>
                            <option value="TH">Thailand (TH)</option>
                            <option value="PH">Philippines (PH)</option>
                            <option value="ME">Middle East (ME)</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="queue-type">Queue</label>
                        <select id="queue" name="queue" value={filters.queue} onChange={changeFilter}>
                            <option value=""></option>
                            <option value="solo">Ranked Solo/Duo</option>
                            <option value="flex">Ranked Flex</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="tier">Tier</label>
                        <select id="tier" name="tier" value={filters.tier} onChange={changeFilter}>
                            <option value=""></option>
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
                        <label htmlFor="division">Division</label>
                        <select id="division" name="division" value={filters.division} onChange={changeFilter}>
                            <option value=""></option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </div>
                </form>
            </div>
            <div id="user-list">
                {loading ? (
                    <p>Loading leaderboard...</p>
                ) : (
                    <>
                        <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p> {/* Display the last updated time */}
                        {data && data.length > 0 ? (
                            data.map((player, index) => (
                                <div key={index} className="player">
                                    <strong>{player.summonerId}</strong><br />
                                    Rank: {player.tier[0].toUpperCase() + player.tier.slice(1).toLowerCase()} {player.rank}<br />
                                    Wins: {player.wins} | Losses: {player.losses}<br />
                                    League Points: {player.leaguePoints}<br />
                                    {player.hotStreak ? 'Hot Streak' : ''}
                                    {player.freshBlood ? 'New Player' : ''}
                                </div>
                            ))
                        ) : (
                            <div>No players found for the selected filters.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Leaderboard;