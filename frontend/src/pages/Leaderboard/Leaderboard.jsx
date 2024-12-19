import React, { useState, useEffect} from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import './Leaderboard.css'

function Leaderboard() {

    const [filters, setFilters] = useState({
        region: '',
        queue: '',
        tier: '',
        division: ''
    });
    const [queue, setQueue] = useState({queue: ''})
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const changeFilter = (event) => {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };
    
    const changeQueue = (event) => {
        setFilters({
            ...filters,
            queue: event.currentTarget.value
        });
    }

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
                <form className="filter-form">
                    <ButtonGroup variant="contained" aria-label="Queue Type">
                        <Button value="solo" onClick={changeQueue} className={`queue-button ${filters.queue === "solo" ? " selected" : ""}`}>Ranked Solo</Button>
                        <Button value="flex" onClick={changeQueue} className={`queue-button ${filters.queue === "flex" ? "selected" : ""}`}>Ranked Flex</Button>
                    </ButtonGroup>
                    <Box sx={{ width: 300}} className="filter-group">
                        <FormControl fullWidth>
                            <InputLabel id="region-select-label">Region</InputLabel>
                            <Select labelId="region-select-label" id="region-select" name = "region" value={filters.region} label="region" onChange={changeFilter}>
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="NA">North America (NA)</MenuItem>
                                <MenuItem value="EUW">Europe West (EUW)</MenuItem>
                                <MenuItem value="EUNE">Europe Nordic & East (EUNE)</MenuItem>
                                <MenuItem value="OCE">Oceania (OCE)</MenuItem>
                                <MenuItem value="RU">Russia (RU)</MenuItem>
                                <MenuItem value="TR">Turkey (TR)</MenuItem>
                                <MenuItem value="BR">Brazil (BR)</MenuItem>
                                <MenuItem value="LAN">Latin America North (LAN)</MenuItem>
                                <MenuItem value="LAS">Latin America South (LAS)</MenuItem>
                                <MenuItem value="JP">Japan (JP)</MenuItem>
                                <MenuItem value="TW">Taiwan (TW)</MenuItem>
                                <MenuItem value="SG">Singapore (SG)</MenuItem>
                                <MenuItem value="TH">Thailand (TH)</MenuItem>
                                <MenuItem value="PH">Philippines (PH)</MenuItem>
                                <MenuItem value="ME">Middle East (ME)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: 150}} className="filter-group">
                        <FormControl fullWidth>
                            <InputLabel id="tier-select-label">Tier</InputLabel>
                            <Select labelId="tier-select-label" id="tier-select" name = "tier" value={filters.tier} label="Tier" onChange={changeFilter}>
                                <MenuItem value="iron">Iron</MenuItem>
                                <MenuItem value="bronze">Bronze</MenuItem>
                                <MenuItem value="silver">Silver</MenuItem>
                                <MenuItem value="gold">Gold</MenuItem>
                                <MenuItem value="platinum">Platinum</MenuItem>
                                <MenuItem value="emerald">Emerald</MenuItem>
                                <MenuItem value="diamond">Diamond</MenuItem>
                                <MenuItem value="master">Master</MenuItem>
                                <MenuItem value="grandmaster">Grandmaster</MenuItem>
                                <MenuItem value="challenger">Challenger</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: 120}} className="filter-group">
                        <FormControl fullWidth>
                            <InputLabel id="division-select-label">Division</InputLabel>
                            <Select labelId="division-select-label" id="division-select" name = "division" value={filters.division} label="division" onChange={changeFilter}>
                                <MenuItem value="I">I</MenuItem>
                                <MenuItem value="II">II</MenuItem>
                                <MenuItem value="III">III</MenuItem>
                                <MenuItem value="IV">IV</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
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