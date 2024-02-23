
// Node imports.
import path from "path";
import bodyParser from 'body-parser';
 
//import  { serverInfo } from "./ServerInfo";

// Library imports.
import express, { Express, NextFunction, Request, Response } from "express";
//import session from 'express-session';



/* old from mailbag App imports.

import {serverInfo} from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts"; 
import { IContact } from "./Contacts";
*/

import {SessionData, Card} from "./typings/express-session/index";


// Our Express app.
const app: Express = express();


var session = require('express-session'); 

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


var suits = ["spar", "ruter", "klver", "hjerter"];
var values = [2,3,4,5,6,7,8,9,10,11,12,13,14];

const crypto = require('crypto');

// Velg ønsket lengde på secret-strengen
const length = 16;

// Generer en unik streng med tilfeldige tall
const randomBytes = crypto.randomBytes(length);

// Konverter den til en hex-streng
const secret_Noth = randomBytes.toString('hex'),
  secret_East = randomBytes.toString('hex'),
  secret_South = randomBytes.toString('hex'),
  secret_West = randomBytes.toString('hex');

/*
interface Card {
  suit: string;
  rank: number;
}
*/

interface SpillerIF {
  secret: string; 
  pos: Plass; 
  my_cards: Array<Card>; 

  receive_cards(cards: Array<Card>): Array<Card>;
  shuffle_cards(cards: Array<Card>): Array<Card>;
  pick_up_cards(cards: Array<Card>): Array<Card>;
  deal_cards(cards: Array<Card>): Array<Card>; 

}


type SuitPreference = {
  [key: string]: number;
};

interface SuitCount {
  [key: string]: number;
}


class Spiller implements SpillerIF {
  secret: string; 
  pos: Plass; 
  my_cards: Array<Card>; 

  constructor(pos: Plass) {
    this.secret = randomBytes.toString('hex');
    this.pos = pos; 
    this.my_cards = []; 
  }

  receive_cards(cards: Array<Card>): Array<Card> {
    this.my_cards = cards; 
    return this.my_cards; 
  }

  
  shuffle_cards(cards: Array<Card>): Array<Card> {
    // Fisher-Yates algorithm for å stokke korten helt rettferdig
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards; 
  }

  min_makker(l:Plass): boolean {
    if (this.pos === l)
      return false; 
    if ((this.pos === Plass.North && l === Plass.South) || (l === Plass.North && this.pos === Plass.South))
      return true; 
    if ((this.pos === Plass.East && l === Plass.West) || (l === Plass.East && this.pos === Plass.West))
      return true; 
    return false; 
  }


  tellPoengOgMeld = (cardio?: Card[]): Melding => {
    let points = 0;
    let suits: SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 

    console.log("Vi har " + b.no_pass + " som har passet"); 

    if (b.no_pass >= 3) 
    {
      b.no_pass++; 
      return {niva: 0, suit: "Pass"}; 
    }

    if (b.siste_i_boksen.melding.niva === 0) //Åpningsmelding
      return this.opening_tellPoengOgMeld(cards); 
    else if (!b.spillere[b.current_bidder].min_makker(b.siste_i_boksen.plass)) //defensiv melding
      return this.defensiv_tellPoengOgMeld(cards);  
    else //egentlig unødvendig test, må være makker som har meldt - eller jeg selv? 
        if (!b.spillere[b.current_bidder].min_makker(b.siste_i_boksen.plass)) //støttemelding
      return this.support_tellPoengOgMeld(cards);
    else {
      b.no_pass++; 
      return {niva: 0, suit: "Pass"}; 
    }
    //Vi har gått runden?  
  }

  opening_tellPoengOgMeld = (cardio?: Card[]): Melding => {
    let points = 0;
    let suits: SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 


    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let rank = card.rank;
      let suit = card.suit;
  
      // Tell poengene for høy ranking av kort, hvor ess = 4, konge = 3, dame = 2 og knekt = 1
      if (rank >= 11) {
        points += rank - 10;
      }
  
      /* Tell 1 poeng for hver av de 4 laveste kortene
      if (rank <= 4) {
        points += 1;
      }*/
  
      // Hold oversikt over antall kort i hver farge
      if (suit in suits) {
        suits[suit]++;
      } else {
        suits[suit] = 1;
      }
    }
  
    /* Legg til poeng for langfarger basert på reglene for naturlig system eller Goren-Cubertson
    let fordelingspoeng = 0; 
    fordelingspoeng += (suits['spar'] >= 5) ? suits['spar'] - 4 : 0;
    fordelingspoeng += (suits['hjerter'] >= 5) ? suits['hjerter'] - 4 : 0;
    fordelingspoeng += (suits['ruter'] >= 5) ? suits['ruter'] - 4 : 0;
    fordelingspoeng += (suits['klver'] >= 5) ? suits['klver'] - 4 : 0;
    */
    let fpo = 0; 
    Object.keys(suits).forEach((key) => {
      if (suits[key] === 0)
        fpo+=3; 
      else if (suits[key] === 1) 
        fpo+=2; 
      else if (suits[key] === 2) 
        fpo+=1; 
      //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
    });
    points+=fpo; 

    // Bestem åpningsmeldingen basert på poengsummen
    
    if (points >= 13) {
      if (points >= 16) {
        return  {niva: 1, suit: 'NT'};  //'1 NT';
      }
      /*
      let longestSuit = Object.keys(suits).reduce((a,b) => suits[a] > suits[b] ? a : b);
      */

      // Løkke med "for"
      for (const suit of Object.keys(suits)) {
        if (suits[suit] > longestLengde) {
          longestLengde = suits[suit]; 
          longestSuit = suit; 
        }
      }
      console.log(`Poeng på hånda: ${points}!`); 
      return {niva: 1, suit: longestSuit}; // `1 ${longestSuit}`;
    }
    console.log(`Poeng på hånda: ${points}!`); 
    b.no_pass++; 
    return {niva: 0, suit: 'Pass'}; //'Pass';
  };
  

  lower_than = (m: Melding, n: Melding): boolean => {
    if (m.niva > n.niva)
      return false; 
    else if (m.niva == n.niva)
      switch (m.suit) {
        case 'NT':
        switch (n.suit) {
          case 'NT':
            return false; 
          break;
          case 'spar':
            return false; 
          break;
          case 'hjerter':
            return false; 
          break;
          case 'ruter':
            return false; 
          break;
          case 'klver':
            return false; 
          break;
          default: 
            return false; 
        }
        break;
        case 'spar':
        switch (n.suit) {
          case 'NT':
            return false; 
          break;
          case 'spar':
            return false; 
          break;
          case 'hjerter':
            return true; 
          break;
          case 'ruter':
            return true; 
          break;
          case 'true':
            return true; 
          break;
          default: 
            return false; 
        }
        break;
        case 'hjerter':
        switch (n.suit) {
          case 'NT':
            return false; 
          break;
          case 'spar':
            return false; 
          break;
          case 'hjerter':
            return false; 
          break;
          case 'ruter':
            return true; 
          break;
          case 'klver':
            return true; 
          break;
          default: 
            return false; 
        }
        break;
        case 'ruter':
        switch (n.suit) {
          case 'NT':
            return false; 
          break;
          case 'spar':
            return false; 
          break;
          case 'hjerter':
            return false; 
          break;
          case 'ruter':
            return false; 
          break;
          case 'klver':
            return true; 
          break;
          default: 
            return false; 
        }
        break;
        case 'klver':
        switch (n.suit) {
          case 'NT':
            return false; 
          break;
          case 'spar':
            return false; 
          break;
          case 'hjerter':
            return false; 
          break;
          case 'ruter':
            return false; 
          break;
          case 'klver':
            return false; 
          break;
          default: 
            return false; 
        }
        break;
        default: 
        return false; 
    }
  else return true; //

  }; 

  defensiv_tellPoengOgMeld = (cardio?: Card[]): Melding => {
    let points = 0;
    let suits: SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 


    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let rank = card.rank;
      let suit = card.suit;
  
      // Tell poengene for høy ranking av kort, hvor ess = 4, konge = 3, dame = 2 og knekt = 1
      if (rank >= 11) {
        points += rank - 10;
      }
  
      /* Tell 1 poeng for hver av de 4 laveste kortene
      if (rank <= 4) {
        points += 1;
      }*/
  
      // Hold oversikt over antall kort i hver farge
      if (suit in suits) {
        suits[suit]++;
      } else {
        suits[suit] = 1;
      }
    }
  
    let fpo = 0; 
    Object.keys(suits).forEach((key) => {
      if (suits[key] === 0)
        fpo+=3; 
      else if (suits[key] === 1) 
        fpo+=2; 
      else if (suits[key] === 2) 
        fpo+=1; 
      
    });
    points+=fpo; 

    // Bestem åpningsmeldingen basert på poengsummen
    
    if (points >= 10) { //melder inn en egen farge maks på 2-ernivå
      // Løkke med "for"
      for (const suit of Object.keys(suits)) {
        if (suits[suit] > longestLengde) {
          longestLengde = suits[suit]; 
          longestSuit = suit; 
        }
      }
      console.log(`Poeng på hånda: ${points}!`);
      if (b.siste_i_boksen.melding.niva < 3) {
        if (this.lower_than(b.siste_i_boksen.melding, {niva: 1, suit: longestSuit}))
          return {niva: 1, suit: longestSuit}; 
        else if (this.lower_than(b.siste_i_boksen.melding, {niva: 2, suit: longestSuit}))
          return {niva: 2, suit: longestSuit}
        else {
          b.no_pass++;
          return {niva: 0, suit: 'Pass'};
        } 
      } 
      else {
        b.no_pass++;
        return {niva: 0, suit: 'Pass'}; //'Pass'; 
      }
      return {niva: 1, suit: longestSuit}; // `1 ${longestSuit}`;
    }
    console.log(`Poeng på hånda: ${points}!`); 
    b.no_pass++; 
    return {niva: 0, suit: 'Pass'}; //'Pass';
  };


  support_tellPoengOgMeld = (cardio?: Card[]): Melding => {
    let points = 0;
    let suits: SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 


    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let rank = card.rank;
      let suit = card.suit;
  
      // Tell poengene for høy ranking av kort, hvor ess = 4, konge = 3, dame = 2 og knekt = 1
      if (rank >= 11) {
        points += rank - 10;
      }
  
  
      // Hold oversikt over antall kort i hver farge
      if (suit in suits) {
        suits[suit]++;
      } else {
        suits[suit] = 1;
      }
    }
  
    let fpo = 0; 
    Object.keys(suits).forEach((key) => {
      if (suits[key] === 0)
        fpo+=3; 
      else if (suits[key] === 1) 
        fpo+=2; 
      else if (suits[key] === 2) 
        fpo+=1; 
      //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
    });
    points+=fpo; 

    // Bestem åpningsmeldingen basert på poengsummen

      // Løkke med "for"
      for (const suit of Object.keys(suits)) {
        if (suits[suit] > longestLengde) {
          longestLengde = suits[suit]; 
          longestSuit = suit; 
        }
      }
    
    console.log(`Poeng på hånda: ${points}!`); 
    
    if (points > 10) //meld lengste farge uansett - litt grovt dette
    {
      if (this.lower_than(b.siste_i_boksen.melding, {niva: b.siste_i_boksen.melding.niva, suit: longestSuit}))
        return {niva: b.siste_i_boksen.melding.niva, suit: longestSuit}; 
      else
        return {niva: b.siste_i_boksen.melding.niva+1, suit: longestSuit}
    }
    else if (points > 6) //støtt så forsiktig som mulig, farge som makker
      return {niva: b.siste_i_boksen.melding.niva+1, suit: b.siste_i_boksen.melding.suit}; 
    //eller i verste fall

    b.no_pass++; 
    return {niva: 0, suit: 'Pass'}; //'Pass';
  
  };

  melding2string(m: Melding): string {
    return m.niva + m.suit;  
  }


  
  suitsOrder: SuitPreference = {
    'spar': 0,
    'hjerter': 1,
    'ruter': 2,
    'klver': 3
  };

  sort_cards(cards: Card[]): Card[] {
    
    return cards.sort((a, b) => {
      // Sorter etter farge
      if (this.suitsOrder[a.suit] < this.suitsOrder[b.suit]) {
        return -1;
      } else if (this.suitsOrder[a.suit] > this.suitsOrder[b.suit]) {
        return 1;
      } else {
        // Hvis fargene er de samme, sorter etter verdi
        if (a.rank < b.rank) {
          return -1;
        } else if (a.rank > b.rank) {
          return 1;
        } else {
          return 0;
        }
      }
  });
  }

  pick_up_cards(cards: Card[]): Card[] {
    this.my_cards = this.sort_cards(cards); 
    printDeck(this.my_cards); 
    //console.log(`Vurderer hva jeg ville meldt om jeg var først: ${this.tellPoengOgMeld(this.my_cards)}`);
    return this.my_cards; 
  }

  deal_cards(deck: Card[]): Card[][] {

    const hands: Card[][] = [[], [], [], []];

    console.log("Får en kortstokk med " + deck.length + " kort"); 
    console.log("Skal fordeles på " + b.playersConnected + " spillere"); 
   
    let kort_til_hver = deck.length / b.playersConnected; 
    console.log("Kort til hver " + kort_til_hver); 


    for (let i = 0; i < kort_til_hver; i++) {
      console.log("i: " + i);
      for (let j = 0; j < b.playersConnected; j++) {
        console.log("j: " + j);
        hands[j][i] = deck.pop();
      }
    }
    return hands;
  }

} 

interface KortBordIF {
  spillere: Spiller[]; 
  _playersConnected: number; 

}

type Meldeboks = {plass: Plass, melding: Melding};
type Melding = {niva: number, suit: string}; 

class KortBord implements KortBordIF {
  _playersConnected: number; 
  spillere: Spiller[] = []; 
  deck = getDeck(); 
  no_pass: number = 0; 

  current_dealer: Plass; 
  current_bidder: Plass; 

  constructor() {
    this._playersConnected = 0; 
    this.current_dealer = Plass.North; 
    this.current_bidder = Plass.North;

  }

  nestespill() {
    if (this.current_dealer < Plass.West)
      this.current_dealer++; 
    else this.current_dealer = Plass.North; 
  }

  nestemelder() {
    if (this.current_bidder < Plass.West)
      this.current_bidder++; 
    else this.current_bidder = Plass.North; 
  }

  nullstill() {
    //this._playersConnected = 0; 
    this.current_dealer = Plass.North;
    this.current_bidder = Plass.North;
    playersReady = 0; 
    this.no_pass = 0; 
  }

  get playersConnected(): number {
    //console.log("Players connected: " + this._playersConnected); 
    return this._playersConnected; 
  }
  public set incPlayersConnected(n: number) {
    this._playersConnected+=n;  
    console.log('Inc to ${this._playersConnected}'); 
  }

  get myDeck() {
    return this.deck;
  }

  set myDeck(d: Card[]) {
    this.deck= d; 
  }

}

enum Plass {North, East, South, West}; 

class BridgeBord extends KortBord {
  //private _no_of_players = 0; 
  private _max_players = 4;  
  

  constructor()  {
    super(); 
    this.spillere = [
      new Spiller(Plass.North),
      new Spiller(Plass.East), 
      new Spiller(Plass.South),
      new Spiller(Plass.West) 
    ];
  }

  get max_players() {
    return this._max_players; 
  }

  /*
  get no_of_players() {
    return this._no_of_players; 
  }
  */




  siste_melding : Melding = {niva: 0, suit: ""}; 
  siste_i_boksen : Meldeboks = {plass: Plass.North, melding: this.siste_melding}; 


  plass2String(p: Plass): string {
    switch (p) {
      case Plass.North:
        return "Nord";
        //break;
      case Plass.East:
        return "Øst";
        //break;    
      case Plass.South:
        return "Syd";
        //break;    
      case Plass.West:
        return "Vest";
        //break;
      default:
        return "Stolleken"; 
        //break;
    }
  }

}

interface Runde {

}

interface Utgang {
  
}

interface Robber {
  
}



let hands: Card[][]; 




let playersConnected = 0;
let playersReady = 0;
 
//const deck: Card[] = [
//  { suit: 'hearts', rank: 1 },
//  { suit: 'hearts', rank: 2 },
// Resten av kortene
//];


/*
{
  const session = req.session as SessionData; 
  session.username = "Steinar"; 
  
  res.send(`Welcome ${session.username} til vår ${session}!`);
});
*/

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
  
  try {
    b.spillere.push(new Spiller(session.username)); 
    //const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
    //await smtpWorker.sendMessage(inRequest.body);
    console.log("POST /ta-plass: Ok");
    inResponse.send("<html><head></head><body></body></html>");
  } catch (inError) {
    console.log("POST /ta-plass: Error", inError);
    inResponse.send("error");
  }
}
);

app.post('/connect', (req, res) => {
  if (playersConnected === b.playersConnected) {
    res.status(503).send('Too many players connected.');
    return;
  }
  playersConnected++;
  res.send({ player: playersConnected });
});
 
const b: BridgeBord = new BridgeBord(); 

app.get('/ready', (req, res) => {
  playersReady++;
  let shuffledDeck: Card[];
  let dealtDeck: Card[][]; 
console.log("Players ready: " + playersReady + " AND SIGNED UP " + b.playersConnected)
  if (playersReady === b.playersConnected) {
    b.myDeck = getDeck(); 
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

      const html_output: string = renderDeck(Plass.North, dealtDeck);     
      console.log("Vi har nok spillere nå");  
      res.send(html_output);

    } catch (e: any) {
      console.log(e);
    }
    playersReady = 0;
  } else {
    // Send et tomt HTML-dokument som respons
    // console.log(`Vi trenger mer enn ${playersReady} spillere!`);
    res.send(`<html><head></head><body> ${playersReady} spillere er klare! </body></html>`);
  }
});


app.get('/meld', (req, res) => {
  
  //current_bidder skal melde og øke med klokka (pluss på 1)
  b.siste_melding = b.spillere[b.current_bidder].tellPoengOgMeld(); 
  let tekst_melding = b.spillere[b.current_bidder].melding2string(b.siste_melding);
  let melding = b.plass2String(b.current_bidder) + " melder " + tekst_melding; 
  
  b.nestemelder();
  res.send(`<html><head></head><body> ${melding} </body></html>`);

});

function printDeck(deck: Card[])
{
  console.log(`Kortstokken inneholder ${deck.length} kort!`)
	for(let i = 0; i < deck.length; i++)
	{
    
      console.log(`Farge: ${deck[i].suit} og valør ${deck[i].rank}. `);
		
	}

	return deck;
}

function getDeck()
{
	let deck: Array<Card> = [];

	for(let i = 0; i < suits.length; i++)
	{
		for(let x = 0; x < values.length; x++)
		{
			let card = {suit: suits[i], rank: values[x], };
			deck.push(card);
      //console.log(`Farge: ${card.suit} og valør ${card.rank}. `);
		}
	}
	return deck;
}


function renderDeck(pl: Plass, deck: Card[]): string
{
  //gjenskap denne i enkel HTML
  //printDeck(b.spillere[Plass.North].pick_up_cards(dealtDeck[Plass.North])); 

  //document.getElementById("deck").innerHTML = "";
 
  // Definer innholdet i HTML-siden
  const h1 = "<h1>Kortene som er gitt</h1>";
  const h2s = ["<h2>Spiller " + pl + " </h2>"]; //, "<h2>Linje 2</h2>", "<h2>Linje 3</h2>"];
  const divs = ["<div>Kortene usortert:</div>"]; // , "<div>Div 2</div>", "<div>Div 3</div>"];

  // Bygg opp HTML-siden ved hjelp av template literals
  const html_start: string = `
    <html>
      <head>
        <title>Dette er kortene vi har fordelt: </title>
      </head>
      <body> `; 

  const html_body = render_body(pl, deck); 

    const html_slutt = `
      </body>
    </html>
    `;

    return html_start + html_body + html_slutt; 
}

function render_body(pl: Plass, deck: Card[][]): string {
  let divs: string = "<div> \n " + `Spiller ${b.plass2String(pl)} har fått følgende kort: \n`
  ; 
  //console.log(`render for ${plass2String(pl)} og ${deck[pl].length}`); 
  divs += "<ul>"; 
  for(let i = 0; i < deck[pl].length; i++)
  {
    //console.log(`Farge: ${deck[pl][i].suit} og valør ${deck[pl][i].rank}. `);
    divs += "<li>\n"; 
    divs = divs + `Farge: ${deck[pl][i].suit} og valør ${deck[pl][i].rank}. \n`;
    divs += "</li>\n"; 
    //console.log(divs); 
  }
  divs += "</ul>"; 
  divs = divs + "\n </div>"; 


  if (pl < Plass.West )
  return divs + render_body(pl + 1, deck); 
    else
  return divs + "\n"; 
}


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