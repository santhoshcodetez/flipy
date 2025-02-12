const express = require('express');
const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Port successfully runs on " + PORT);
});
