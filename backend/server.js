import express from "express";

const PORT = 5000;
const app = express();

app.get('/', (req, res) => {
    res.send('api is running...')
})

app.listen(PORT, () => console.log(`app is running in port ${PORT}`))
