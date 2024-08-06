require("dotenv").config();
const express = require("express"); 
const bodyParser= require("body-parser");
const fs = require("fs");
const path  = require("path");
const cors=require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes")
const pokemonRoutes = require('./routes/pokemonRoutes'); 

app.use(cors());
app.use(bodyParser.json()); 
app.use('/api/pokemons', pokemonRoutes); 
app.use("/api/users",userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));