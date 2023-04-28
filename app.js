const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

// API1

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
  SELECT
    *
  FROM
    cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

// app.get("/players/", async (request, response) => {
//   const getPlayerQuery = `
//   SELECT
//     *
//   FROM
//     cricket_team;`;
//   const playersArray = await db.all(getPlayersQuery);
//   response.send(
//       playersArray.map(eachPlayer) =>
//         convertDbObjectToResponseObject(eachPlayer)
//       )
//     );
// });

module.exports = app;
