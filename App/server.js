const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('public')); // Serves frontend files

// Utility function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Endpoint to create a new game
app.post('/create', (req, res) => {
  const { players } = req.body;
  const playerNames = players.split(',').map((name) => name.trim());

  if (playerNames.length < 2) {
    return res.status(400).json({ error: 'At least two players are required.' });
  }

  const shuffledPlayers = shuffleArray([...playerNames]);
  const game = shuffledPlayers.map((player, index) => ({
    killer: player,
    victim: shuffledPlayers[(index + 1) % shuffledPlayers.length]
  }));

  const gameData = {
    game,
    revealedVictims: [] // Initialize with an empty array to track revealed players
  };

  // Save the most recent game to a file
  fs.writeFile('game.json', JSON.stringify(gameData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create game' });
    }
    res.json({ message: 'Game created successfully!' });
  });
});

app.get('/players', (req, res) => {
  fs.readFile('game.json', 'utf8', (err, fileData) => {
    if (err || !fileData) {
      return res.status(404).json({ error: 'No game found' });
    }

    const { game } = JSON.parse(fileData);
    const players = game.map((entry) => entry.killer);

    // Shuffle the players before sending them to the client
    const shuffledPlayers = shuffleArray(players);

    res.json(shuffledPlayers);
  });
});

// Endpoint to get the victim for a selected player
app.post('/victim', (req, res) => {
  const { player } = req.body;

  fs.readFile('game.json', 'utf8', (err, fileData) => {
    if (err || !fileData) {
      return res.status(404).json({ error: 'No game found' });
    }

    let gameData = JSON.parse(fileData);
    const { game, revealedVictims } = gameData;

    // Check if the player has already seen their victim
    if (revealedVictims.includes(player)) {
      return res.status(403).json({ error: 'You have already seen your victim.' });
    }

    const playerEntry = game.find((entry) => entry.killer === player);

    if (!playerEntry) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Add the player to the revealed list
    revealedVictims.push(player);

    // Save updated game state with revealed player
    fs.writeFile('game.json', JSON.stringify(gameData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save player state' });
      }

      res.json({ victim: playerEntry.victim });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
