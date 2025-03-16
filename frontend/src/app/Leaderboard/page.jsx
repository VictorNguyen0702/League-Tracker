"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button" 
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import PaginatedTable from "@/components/paginatedTable";

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

  const changeFilter = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
    console.log("Filters:", filters);
    console.log("Queue:", filters.queue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="p-10"
    >
      <h2 className="text-2xl font-bold text-center justify-center">Rank Leaderboards</h2>
      <div className="flex flex-row p-10 gap-10">
        <div id="filters" className="flex flex-col gap-10 max-h-[412px] rounded-xl p-10 bg-[var(--snowDark)]">
          <h2 className="text-xl text-center justify-center font-bold">Filters</h2>
          <div id="queue-buttons" className="flex flex-row gap-10">
            <Button value="solo" onClick={(event) => changeFilter("queue", event.target.value)} className={`bg-[var(--polarLight)] text-[var(--snowLight)] transition-shadow ${
              filters.queue === "solo" ? "shadow-3xl" : ""}`}>Ranked Solo</Button>
            <Button value="flex" onClick={(event) => changeFilter("queue", event.target.value)} className={`bg-[var(--polarLight)] text-[var(--snowLight)] transition-shadow ${
              filters.queue === "flex" ? "shadow-3xl" : ""}`}>Ranked Flex</Button>
          </div>
          <div id="filter-dropdown-group" className="w-full flex flex-col gap-10">
            <Select onValueChange={(value) => changeFilter("region", value)} className="w-full">
              <SelectTrigger className="w-full bg-[var(--polarLight)] text-[var(--snowDark)]">
                <SelectValue placeholder="Select a Region"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="NA">North America (NA)</SelectItem>
                  <SelectItem value="EUW">Europe West (EUW)</SelectItem>
                  <SelectItem value="EUNE">Europe Nordic & East (EUNE)</SelectItem>
                  <SelectItem value="OCE">Oceania (OCE)</SelectItem>
                  <SelectItem value="RU">Russia (RU)</SelectItem>
                  <SelectItem value="TR">Turkey (TR)</SelectItem>
                  <SelectItem value="BR">Brazil (BR)</SelectItem>
                  <SelectItem value="LAN">Latin America North (LAN)</SelectItem>
                  <SelectItem value="LAS">Latin America South (LAS)</SelectItem>
                  <SelectItem value="JP">Japan (JP)</SelectItem>
                  <SelectItem value="TW">Taiwan (TW)</SelectItem>
                  <SelectItem value="SG">Singapore (SG)</SelectItem>
                  <SelectItem value="TH">Thailand (TH)</SelectItem>
                  <SelectItem value="PH">Philippines (PH)</SelectItem>
                  <SelectItem value="ME">Middle East (ME)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => changeFilter("tier", value)}>
              <SelectTrigger className="w-full bg-[var(--polarLight)] text-[var(--snowDark)]">
                <SelectValue placeholder="Select a Tier"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="iron">Iron</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="emerald">Emerald</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="grandmaster">Grandmaster</SelectItem>
                  <SelectItem value="challenger">Challenger</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => changeFilter("division", value)}>
              <SelectTrigger className="w-full bg-[var(--polarLight)] text-[var(--snowDark)]">
                <SelectValue placeholder="Select a Tier"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="I">I</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <PaginatedTable filters={filters} />
      </div>
    </motion.div>
  )
}

export default Leaderboard;