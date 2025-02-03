const express = require('express');

const app = express();

app.get("/", (req, res)=> {
    res.send("Hello from server!");
})

app.get("/test", (req, res)=> {
    res.send("Hello from test url!");
})

app.listen(3000, ()=> {
    console.log('Server listening on port 3000');
});