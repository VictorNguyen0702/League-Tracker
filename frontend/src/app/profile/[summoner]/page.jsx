"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { summoner } = useParams();

  // Mock Data (Replace with API Call)
  const profile = {
    name: summoner || "Unknown Summoner",
    rank: "Diamond I",
    wins: 120,
    losses: 80,
    recentMatches: [
      { id: 1, champion: "Ahri", win: true, kda: "10/2/8" },
      { id: 2, champion: "Yasuo", win: false, kda: "5/7/3" },
      { id: 3, champion: "Jhin", win: true, kda: "15/1/9" },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      className="flex flex-col w-full bg-[var(--snowLight)] text-white p-10 gap-10 min-h-screen "
    >
      <h2 className="text-2xl text-[var(--polarDark)] font-bold text-center justify-center">{profile.name}'s Profile</h2>

      <div className="flex flex-col w-full gap-10">
        {/* Profile Header */}
        <div className="flex flex-row items-center p-10 gap-4 rounded-xl bg-[var(--snowDark)]">
          <img src="/profile-photo.png" alt="Profile Icon" className="w-24 h-24 rounded-full"/>
          <div className="text-[var(--polarLight)]">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p>
              {profile.wins}W / {profile.losses}L ({Math.round((profile.wins / (profile.wins + profile.losses)) * 100)}% WR)
            </p>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="w-full p-10 rounded-xl bg-[var(--snowDark)]">
          <h2 className="text-xl text-center text-[var(--polarDark)] font-semibold mb-4">Recent Matches</h2>
          <div className="flex flex-col w-full gap-2">
            {profile.recentMatches.map((match) => (
              <div id={match} className={`w-full ${match.win ? "bg-[var(--snowMid2)]" : "bg-[var(--polarMed2)]"} p-4 rounded-lg`}>
                {/* Content here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
