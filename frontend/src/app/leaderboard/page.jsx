"use client"
import { useState, useEffect } from "react";


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
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  useEffect(() => {
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

  useEffect(() => {
    if (data && data.length > 0) {
      const playerRows = data.map((player) => ({
        name: player.summonerId,
        rank: player.tier[0].toUpperCase() + player.tier.slice(1).toLowerCase() + " " + player.rank,
        winRate: player.wins + " | " + player.losses,
        leaguePoints: player.leaguePoints,
        hotStreak: player.hotStreak ? '🔥' : '',
        freshBlood: player.freshBlood ? '🐣' : '',
        veteran: player.veteran ? '🧙‍♂️' : '',
      }));
      setRows(playerRows);
    }
  }, [data]); // Only run this effect when the data changes
  
  return (
    <div></div>
  )
}

export default Leaderboard;