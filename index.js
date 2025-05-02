const dotenv = require('dotenv');
dotenv.config();
const server = require('./src/server');

// Get port from env
const PORT = process.env.PORT || 5001;

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});