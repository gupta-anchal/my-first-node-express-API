// This is using express
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

require("./models/index");
const UserRoutes = require("./routes/user.routes")
//import express from ("express") - ES6
const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use("/",(req, res)=>{
//     res.status(200).send("Server is running!!!")
// })

app.use("/users",UserRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serve is listening on port :  ${port}`)
}) 

//This is using http
// const http = require("http");
// const port = process.env.PORT || 5000;
// const host="localhost";
// const requestListener =(req,res)=>{
//     res.writeHead(200);
//     res.end("My first server");
// }
// const server = http.createServer(requestListener);

// server.listen(port, host, () =>{
//     console.log(`Server is listening on port :  http://${host}:${port}`);
// });