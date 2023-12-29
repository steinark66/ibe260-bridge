import path from "path";
import express, 
    { Express, NextFunction, Request, Response } from "express"; 
//import  { serverInfo } from "./ServerInfo";

const app: Express = express(); 

app.use(express.json()); 

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext(); 
});

app.get("/", (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send("Her kan jeg skrive mine aller første tegn tilbake til browseren");
});

app.listen(3030, () => {
  console.log("Server listening on port 3030");
});