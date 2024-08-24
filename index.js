const express = require('express')
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express()

//MiddleWare
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

app.get('/', (req, res) => {
  res.send({"server_name": "Genius Gala"})
})

app.listen(port, () => {
  console.log(`Genius Gala API is running on port ${port}`)
})