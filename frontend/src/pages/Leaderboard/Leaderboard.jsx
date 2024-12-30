import * as React from 'react';
import axios from 'axios';

import { Box, InputLabel, MenuItem, FormControl, Select, Button, Typography, 
         Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, 
         TableRow, Paper, IconButton, useTheme } from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
  
import './Leaderboard.css'

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };


function Leaderboard() {

    const [filters, setFilters] = React.useState({
        region: '',
        queue: '',
        tier: '',
        division: ''
    });
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [lastUpdated, setLastUpdated] = React.useState(null);

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
    const [rows, setRows] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const columns = [
        { field: 'name', headerName: 'Summoner Name', width: 150 },
        { field: 'rank', headerName: 'Rank', width: 130 },
        { field: 'winRate', headerName: 'Win | Loss', width: 120 },
        {
          field: 'leaguePoints',
          headerName: 'League Points',
          type: 'number',
          width: 110,
        },
        {
          field: 'hotStreak',
          headerName: 'Hot Streak',
          description: 'Indicates if the player is on a hot streak.',
          sortable: false,
          width: 100,
        },
        {
          field: 'freshBlood',
          headerName: 'Newbie',
          description: 'Indicates if the player is new.',
          sortable: false,
          width: 100,
        },
      ];
      
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    function refreshData() {
        const { region, queue, tier, division } = filters;
        if (region === "" || queue === ""  || tier === ""  || division === "" ) {
            setData([]);
            setLastUpdated(null);
            setLoading(false);
            return
        }
        setLoading(true);
        axios.post(`http://127.0.0.1:8000/leaderboard/${filters.region}/${filters.queue}/${filters.tier}/${filters.division}`)
        .then((postResponse) => {
            setData(postResponse.data.users);
            setLastUpdated(postResponse.data.last_updated);
        })
        .catch((error) => {
            console.error("Error sending POST request:", error);
        })
        .finally(() => {
            setLoading(false);
        });;
    }

    React.useEffect(() => {
        const { region, queue, tier, division } = filters;
        if (region === "" || queue === ""  || tier === ""  || division === "" ) {
            setData([]);
            setLastUpdated(null);
            setLoading(false);
            return
        }
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/leaderboard/${filters.region}/${filters.queue}/${filters.tier}/${filters.division}`)
            .then((response) => {
                if (response.data.users && response.data.users.length > 0) {
                    setData(response.data.users);
                    setLastUpdated(response.data.last_updated);  
                } else {
                    axios.post(`http://127.0.0.1:8000/leaderboard/${filters.region}/${filters.queue}/${filters.tier}/${filters.division}`)
                    .then((postResponse) => {
                        console.log(postResponse.data)
                        setData(postResponse.data.users);
                        setLastUpdated(postResponse.data.last_updated);
                    })
                    .catch((error) => {
                        console.error("Error sending POST request:", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });;
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [filters]);

    React.useEffect(() => {
        if (data && data.length > 0) {
            const playerRows = data.map((player) => ({
                name: player.summonerId,
                rank: player.tier[0].toUpperCase() + player.tier.slice(1).toLowerCase() + " " + player.rank,
                winRate: player.wins + " | " + player.losses,
                leaguePoints: player.leaguePoints,
                hotStreak: player.hotStreak ? '🔥' : '',
                freshBlood: player.freshBlood ? '🐣' : '',
            }));
            setRows(playerRows);
        }
    }, [data]); // Only run this effect when the data changes


    return (
        <>
            <div id="leaderboard-title" className="title">
                <Typography id="title" variant="h3">Rank Leaderboard</Typography>
            </div>
            <div id="leaderboard-body">
                <div id="filters">
                    <div id="queue-buttons">
                        <Button value="flex" onClick={changeQueue} className={`queue-button${filters.queue === "flex" ? " selected" : " unselected"}`}>Ranked Flex</Button>
                        <Button value="solo" onClick={changeQueue} className={`queue-button${filters.queue === "solo" ? " selected" : " unselected"}`}>Ranked Solo</Button>
                    </div>
                    <div id="filter-dropdown-group">
                        <Box sx={{ width: 300}} className="filter-dropdown">
                            <FormControl fullWidth>
                                <InputLabel id="region-select-label">Region</InputLabel>
                                <Select labelId="region-select-label" id="region-select" className="filter-select" name = "region" value={filters.region} label="region" onChange={changeFilter}>
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
                                    <MenuItem value="ME">Middle East (ME)</MenuItem>
                                    <MenuItem value="KR">Korea (KR)</MenuItem>
                                    <MenuItem value="VN">Vietnam (VN)</MenuItem>
                                    <MenuItem value="TH">Thailand (TH)</MenuItem>
                                    <MenuItem value="PH">Philippines (PH)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ width: 150}} className="filter-dropdown">
                            <FormControl fullWidth>
                                <InputLabel id="tier-select-label">Tier</InputLabel>
                                <Select labelId="tier-select-label" id="tier-select" className="filter-select" name = "tier" value={filters.tier} label="Tier" onChange={changeFilter}>
                                    <MenuItem value=""></MenuItem>
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
                        <Box sx={{ width: 120}} className="filter-dropdown">
                            <FormControl fullWidth>
                                <InputLabel id="division-select-label">Division</InputLabel>
                                <Select labelId="division-select-label" id="division-select" className="filter-select" name = "division" value={filters.division} label="division" onChange={changeFilter}>
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="I">I</MenuItem>
                                    <MenuItem value="II">II</MenuItem>
                                    <MenuItem value="III">III</MenuItem>
                                    <MenuItem value="IV">IV</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <div id="update-div">
                            {data && data.length > 0 ? (<p id="last-update">Last Update: {new Date(lastUpdated).toLocaleString()}</p>) : (<p id="last-update">Last Update: N/A</p>)}
                            <Button id="refresh-button" onClick={refreshData}>Refresh</Button>
                        </div>
                    </div>
                </div>
                <div id="leaderboard">
                    <div id="user-list">
                        {loading ? (
                            <p>Loading leaderboard...</p>
                        ) : (
                        <TableContainer id="leaderboard-table-container" component={Paper}>
                            <Table id="leaderboard-table" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell id="player-name-label" className="table-column-label">Player Name</TableCell>
                                        <TableCell id="rank-label" className="table-column-label">Rank</TableCell>
                                        <TableCell id="winrate-label" className="table-column-label">Wins | Losses</TableCell>
                                        <TableCell id="lp-label" className="table-column-label">LP</TableCell>
                                        <TableCell id="hot-streak-label" className="table-column-label">Hot Streak</TableCell>
                                        <TableCell id="fresh-blood-label" className="table-column-label">Fresh Blood</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                    ).map((row) => (
                                    <TableRow key={row.name} id="user-row">
                                        <TableCell component="th" scope="row">
                                        {row.name}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.rank}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.winRate}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.leaguePoints}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.hotStreak}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.freshBlood}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="right">
                                        {row.veteran}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination id="table-pagination"
                                            rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                                            colSpan={3}
                                            count={rows.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            slotProps={{
                                            select: {
                                                inputProps: {
                                                'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            },
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard;
