import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react"

import "./App.css"
import Header from "./components/Header/Header.jsx";
import Leaderboard from "./pages/Leaderboard/Leaderboard.jsx";
import Home from "./pages/Home/Home.jsx"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <BrowserRouter>
                <Header />

                <Routes>
                    <Route path = "/" element =  {<Home />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
            </BrowserRouter>

        </>
    )
}

export default App
