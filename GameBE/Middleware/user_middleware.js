const express = require('express');
const app = express();

// Middleware để phân tích JSON body
app.use(express.json());

// Middleware để ghi log
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
