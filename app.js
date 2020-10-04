const express = require("express");
const bodyParser= require("body-parser");
const https= require("https");

const app= new express();
app.use(bodyParser);



app.listen(3000,function(){
  console.log("Server is running at port 3000");
})
