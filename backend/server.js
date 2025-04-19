const express = require('express');
const app = express();
const chatRouter = require('./routes/chat');

// ... existing middleware setup ...

app.use('/', chatRouter);

// ... rest of the server code ... 