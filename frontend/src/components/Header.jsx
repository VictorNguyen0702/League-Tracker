import Link from "next/link";

function Header() {

    return (
        <div id="header">
            <nav>
                <Link href="/users">Users</Link>
                <Link href="/leaderboard">Leaderboard</Link>
            </nav>
        </div>
    )
}

export default Header;