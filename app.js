const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const app = express();
const PORT = process.env.PORT || 5000;
//const PORT = 5000;

mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To Database");
  })
  .catch((err) => {
    console.log("Can't Connected To Database");
  });

require("./models/user");
require("./models/room");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/room"));
app.use(require("./routes/user"));


if(process.env.NODE_ENV == "production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "client", "build","index.html"))
  })
} 

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
