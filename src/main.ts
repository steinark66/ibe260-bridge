
// Node imports.
import path from "path";
import bodyParser from 'body-parser';

// Library imports.
import express, { Express, NextFunction, Request, Response } from "express";
//Trenger (senere) session from 'express-session', som jeg tar fra type-utvidelser for Response;
import {SessionData, Card} from "./typings/express-session/index";

// Blir stort nok dette prosjektet, så jeg deler det opp 
import { KortBord, BridgeBord, Plass } from './Bord'; 
import {Spiller} from './Spiller'; 
import * as Utils from "./Utils"; 

// Our Express app.
const app: Express = express();

var session = require('express-session'); //gammel skrivemåte - rydd opp

const b: BridgeBord = new BridgeBord(); 

// Handle JSON in request bodies.
app.use(express.json());
app.use(bodyParser.json());

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

// Serve the client.
app.use("/", express.static(path.join(__dirname, "../../client/dist")));


// Enable CORS so that we can call the API even from anywhere.
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  inNext();
});

// Konverter den til en hex-streng
const secret_Noth = Utils.randomBytes.toString('hex'),
  secret_East = Utils.randomBytes.toString('hex'),
  secret_South = Utils.randomBytes.toString('hex'),
  secret_West = Utils.randomBytes.toString('hex');

app.post("/ta-plass",
async (inRequest: Request, inResponse: Response) => {
  
  const session = inRequest.session as SessionData; 
  const json = inRequest.body; // Leser JSON fra forespørselens kropp
  console.log(json); // Skriver ut JSON-objektet i konsollen
  console.log("Undefined? " + json.Navn);

  session.username = json.Navn as string; 
  session.telefonnr = json.Telefon as string; //kan bruke som id, kanskje
 
  console.log("POST /ta-plass", inRequest.body);
  console.log(`Welcome ${session.username} til vår ${session}!`);
  console.log(`Er ${session.telefonnr} riktig ?`);

  if (b.playersConnected === b.max_players) {
    inResponse.status(503).send('Too many players connected.');
    return;
  }

  b.incPlayersConnected=1; 
  if (b.playersConnected === 4)
    //b = new BridgeBord();
    b.nullstill(); 
  try {
    
    b.spillere.push(new Spiller(session.username, b)); 
    console.log("POST /ta-plass: Ok");
    inResponse.send("<html><head></head><body></body></html>");
  } catch (inError) {
    console.log("POST /ta-plass: Error", inError);
    inResponse.send("error");
  }
}
);

app.get('/ready', (req, res) => {
  b.playersReady++;
  let shuffledDeck: Card[];
  let dealtDeck: Card[][]; 

  console.log("Players ready: " + b.playersReady + " AND SIGNED UP " + b.playersConnected)
  
if (b.playersReady === b.playersConnected) {
    b.myDeck = Utils.getDeck(); 
    shuffledDeck = b.spillere[b.current_dealer].shuffle_cards(b.myDeck);
    try {
      
      dealtDeck = b.spillere[b.current_dealer].deal_cards(shuffledDeck); 
      
      //console.log('Dette er ' + Plass.North + ' sine kort'); printDeck(
        b.spillere[Plass.North].pick_up_cards(dealtDeck[Plass.North] //)
        ); 
      //console.log('Dette er ' + Plass.East + ' sine kort'); printDeck(
        b.spillere[Plass.East].pick_up_cards(dealtDeck[Plass.East] //)
        ); 
      //console.log('Dette er ' + Plass.South + ' sine kort'); printDeck(
        b.spillere[Plass.South].pick_up_cards(dealtDeck[Plass.South] //)
        ); 
      //console.log('Dette er ' + Plass.West + ' sine kort'); printDeck(
        b.spillere[Plass.West].pick_up_cards(dealtDeck[Plass.West] //)
        ); 

      const html_output: string = Utils.renderDeck(Plass.North, dealtDeck, b);     
      console.log("Vi har nok spillere nå");  
      res.send(html_output);

    } catch (e: any) {
      console.log(e);
    }
    b.playersReady = 0;
  } else {
    // Send et tomt HTML-dokument som respons
    // console.log(`Vi trenger mer enn ${playersReady} spillere!`);
    res.send(`<html><head></head><body> ${b.playersReady} spillere er klare! </body></html>`);
  }
});


app.get('/meld', (req, res) => {
  
  //current_bidder skal melde og øke med klokka (pluss på 1)

  let siste_m = b.spillere[b.current_bidder].tellPoengOgMeld(); 

  if (siste_m.niva !== 0) //pass 
  {
    b.siste_melding = siste_m; 
    b.siste_i_boksen = {plass: b.current_bidder, melding: b.siste_melding}; 
  }

  let tekst_melding = Utils.melding2string(siste_m);

  let melding = b.plass2String(b.current_bidder) + " melder " + tekst_melding + " med "
    + b.spillere[b.current_bidder].poeng + " poeng "; 
  
  if (b.no_pass < 4) 
  { 
    b.nestemelder();
    res.send(`<html><head></head><body> ${melding} </body></html>`);
  } else 
  {
    b.no_pass = 0; 
    res.send(`<html><head></head><body> Da kan dere begynne å spille - alle har passet </body></html>`);
  }

});


app.get("/nullstill", (req, res) => {
  b.nullstill(); 
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send("Nå kan du starte et nytt spill");
});

app.get("/nestespill", (req, res) => {
  b.nestespill(); 
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send("Er dere klare for et nytt spill?");
});


app.get("/", (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send("Her kan jeg skrive mine spede forsøk på å lage en bridge-robot");
});



app.listen(3030, () => {
  console.log("Serveren lytter på port 3030");
});