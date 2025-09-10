const path = require('path');
const cron = require('node-cron');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const searchRouter = require('./routes/search');
const artistRouter = require('./routes/artist');
const artworkRouter = require('./routes/artwork');
const geneRouter = require('./routes/gene');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const connection = require("./db");

const { fetchToken } = require('./fetchToken');


//database
connection();

// Fetch the Artsy token on server start
fetchToken();

// Schedule token refresh every 7 days (example cron schedule)
cron.schedule('0 0 */7 * *', () => {
  fetchToken();
  console.log('Token refresh triggered by cron job.');
});


app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist/client/browser')));

// Use the router for /api/search
app.use('/api/search', searchRouter);
app.use('/api/artist', artistRouter);
app.use('/api/artwork', artworkRouter);
app.use('/api/gene', geneRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Simple root endpoint
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/client/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
