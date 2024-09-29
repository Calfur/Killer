async function fetchPlayers() {
    try {
        const response = await fetch('/players');
        const players = await response.json();

        const dropdown = document.getElementById('playerDropdown');
        players.forEach((player) => {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

function initSubmitPlayerForm(){
    document.getElementById('playerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedPlayer = document.getElementById('playerDropdown').value;
        if (!selectedPlayer) {
            return;
        }
    
        const response = await fetch('/victim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: selectedPlayer })
        });
        const result = await response.json();
    
        if (response.status === 403) {
            document.getElementById('victimMessage').textContent = `Error: ${result.error}`;
        } else if (response.status === 200) {
            document.getElementById('victimMessage').textContent = `Dein Opfer ist: ${result.victim}`;
        }
    });
}

function initSubmitCreateForm(){
    document.getElementById('createForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const players = document.getElementById('players').value;
  
        const response = await fetch('/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ players })
        });
        const result = await response.json();
        document.getElementById('createMessage').textContent = result.message;
      });
}