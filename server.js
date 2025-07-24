const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to save game results
app.post('/api/game-result', (req, res) => {
  const { winner, difficulty, mode } = req.body;
  
  // In a real app, you would save this to a database
  console.log('Game result:', { winner, difficulty, mode, timestamp: new Date() });
  
  res.json({ success: true });
});

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});