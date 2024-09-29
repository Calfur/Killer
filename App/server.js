const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('public')); // Serves frontend files

app.post('/save', (req, res) => {
  const { input } = req.body;
  const data = { input };

  fs.readFile('data.json', 'utf8', (err, fileData) => {
    const jsonData = fileData ? JSON.parse(fileData) : [];
    jsonData.push(data);

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.json({ message: 'Data saved successfully!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
