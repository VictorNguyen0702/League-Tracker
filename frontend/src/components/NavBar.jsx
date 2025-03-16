'use client';
import React from 'react';
import { House, User, Wrench, FolderKanban } from "lucide-react";
import { motion } from 'framer-motion';
import Link from "next/link";


export default function Navbar() {


  return (
    <nav className="w-full bg-[var(--polarDark)] shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-lg font-bold"></div>

      {/* Desktop Navigation (Hidden on Small Screens) */}
        <div className="hidden md:flex text-[var(--snowMid1)] space-x-6 gap-10 pr-40">
          <Link href="/profiles" className="flex flex-row gap-2 items-center inline-block transition-transform duration-300 hover:-translate-y-1">
            Profiles
          </Link>
          <Link href="/leaderboard" className="flex flex-row gap-2 inline-block transition-transform duration-300 hover:-translate-y-1">
            Leaderboard
          </Link>
          <Link href="#skills" className="flex flex-row gap-2  inline-block transition-transform duration-300 hover:-translate-y-1">

          </Link>
          <Link href="#projects" className="flex flex-row gap-2  inline-block transition-transform duration-300 hover:-translate-y-1">

          </Link>
        </div>
    </nav>
  );
}
