# League Tracker

League Tracker is a web application that allows users to track player statistics and view overall leaderboards for competitive matches.

## Features
- Search for player profiles and view detailed match history
- Track rankings and performance over time
- Display overall leaderboards for different ranks and divisions
- Responsive UI with custom theming based on the Nord color palette

## Technologies Used
- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** FastAPI, MongoDB
- **Libraries:** Framer Motion, ShadCN UI

## Installation
### Prerequisites
- Node.js and npm
- Python 3 with FastAPI installed
- MongoDB (local or cloud instance)

### Setup
Clone the repository:
```sh
git clone https://github.com/yourusername/league-tracker.git
cd league-tracker
```

#### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

#### Backend Setup
```sh
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Folder Structure
```
league-tracker/
├── backend/  # FastAPI backend
│   ├── main.py
│   ├── mongo.py
│   ├── api_calls.py
│
├── frontend/  # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   │   ├── [summoner].jsx
│   │   ├── components/
│   │   └── styles/
│   ├── public/
│   ├── pages/
│   └── package.json
│
└── README.md
```

## Usage
1. Start the backend and frontend services
2. Navigate to `http://localhost:3000`
3. Search for a summoner to track their stats and view leaderboards

## API Routes
- `GET /profile/{summoner}` - Fetch player profile and match history
- `GET /leaderboard` - Retrieve overall rankings
- `POST /update` - Update user stats manually

## Troubleshooting
- If `useRouter` errors occur, ensure you are using `usePathname` instead of `useRouter` for Next.js 13+.
- If Tailwind custom colors are not working, ensure they are correctly added in `tailwind.config.js`.

## Contributing
Feel free to fork the repository and submit a pull request if you have any improvements or new features to add!

## License
This project is licensed under the MIT License.

