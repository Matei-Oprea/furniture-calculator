const dotenv = require('dotenv');
dotenv.config();
const server = require('./src/server');

// Use port 8080 to avoid any conflicts
const PORT = 9000;

// Start server
server.listen(PORT, () =>
{
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});