"use client";
import { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from 'axios';


export default function PaginatedTable( {filters} ) {
  const [data, setData] = useState([""]); // Full dataset
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const [rows, setRows] = useState([]);
  const rowsPerPage = 15;


  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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
      } else {
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/leaderboard/${filters.region}/${filters.queue}/${filters.tier}/${filters.division}`)
            .then((response) => {
                if (response.data.users && response.data.users.length > 0) {
                    setData(response.data.users);
                    setLastUpdated(response.data.last_updated);  
                } else {
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
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
      }


  }, [filters]);  // Only run this effect when the filters change

  useEffect(() => {
    if (data && data.length > 1) {
      const playerRows = data.map((player) => ({
        name: player.summonerId,
        rank: player.tier[0].toUpperCase() + player.tier.slice(1).toLowerCase() + " " + player.rank,
        gameCount: player.wins + " | " + player.losses,
        winRate: Math.round((player.wins / (player.wins + player.losses)) * 100) + "%",
        leaguePoints: player.leaguePoints,
        hotStreak: player.hotStreak ? '🔥' : '',
      }));
      setRows(playerRows);
    }
  }, [data]); // Only run this effect when the data changes
  
  const emptyRows = currentPage > 0 ? Math.max(0, (1 + currentPage) * rowsPerPage - rows.length) : 0;
  

  const paginatedRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
  
    const offset = currentPage * rowsPerPage;
    let newRows = rows.slice(offset, offset + rowsPerPage);
  
    // Ensure last page has empty rows for consistent height
    const emptyRows = Math.max(0, rowsPerPage - newRows.length);
    for (let i = 0; i < emptyRows; i++) {
      newRows.push({ name: "", rank: "", winRate: "", leaguePoints: "", hotStreak: "", freshBlood: "", veteran: "" });
    }
    return newRows;
  }, [rows, currentPage]);
  

  // Handle page change
  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="w-full rounded-xl p-10 bg-[var(--snowDark)]">
      <h1 className="text-xl text-center font-bold text-[var(--polarDark)]  mb-4">League of Legends Players</h1>
      <Table cl>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Win | Loss</TableHead>
            <TableHead>Win Rate</TableHead>
            <TableHead>LP</TableHead>
            <TableHead>Hot Streak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index} className="h-10">
              <TableCell scope="row">{row.name}</TableCell>
              <TableCell>{row.rank}</TableCell>
              <TableCell>{row.gameCount}</TableCell>
              <TableCell>{row.winRate}</TableCell>
              <TableCell>{row.leaguePoints}</TableCell>
              <TableCell>{row.hotStreak}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination UI */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={<Button variant="outline">Prev</Button>}
          nextLabel={<Button variant="outline">Next</Button>}
          breakLabel={"..."}
          pageCount={Math.ceil(data.length / rowsPerPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"flex items-center gap-2"}
          activeClassName={"bg-gray-200 p-2 rounded"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
}
