const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const buildPath = path.join(__dirname, 'build');

console.log(`Starting Express server...`);
console.log(`Build path: ${buildPath}`);
console.log(`Build directory exists: ${fs.existsSync(buildPath)}`);

if (fs.existsSync(buildPath)) {
  console.log(`Contents of build directory:`, fs.readdirSync(buildPath).slice(0, 10));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Frontend server is running' });
});

// Serve static files from the build directory
app.use(express.static(buildPath));

// Serve index.html for all other routes (for React Router SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return res.status(404).json({ 
      error: 'index.html not found', 
      buildPath: buildPath,
      indexPath: indexPath,
      buildDirExists: fs.existsSync(buildPath)
    });
  }
  
  res.sendFile(indexPath);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving React app from ${buildPath}`);
});



