"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node imports.
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
// Library imports.
const express_1 = __importDefault(require("express"));
// Blir stort nok dette prosjektet, så jeg deler det opp 
const Bord_1 = require("./Bord");
const Spiller_1 = require("./Spiller");
const Utils = __importStar(require("./Utils"));
// Our Express app.
const app = (0, express_1.default)();
var session = require('express-session'); //gammel skrivemåte - rydd opp
const b = new Bord_1.BridgeBord();
// Handle JSON in request bodies.
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));
// Serve the client.
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
// Enable CORS so that we can call the API even from anywhere.
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
// Konverter den til en hex-streng
const secret_Noth = Utils.randomBytes.toString('hex'), secret_East = Utils.randomBytes.toString('hex'), secret_South = Utils.randomBytes.toString('hex'), secret_West = Utils.randomBytes.toString('hex');
app.post("/ta-plass", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const session = inRequest.session;
    const json = inRequest.body; // Leser JSON fra forespørselens kropp
    console.log(json); // Skriver ut JSON-objektet i konsollen
    console.log("Undefined? " + json.Navn);
    session.username = json.Navn;
    session.telefonnr = json.Telefon; //kan bruke som id, kanskje
    console.log("POST /ta-plass", inRequest.body);
    console.log(`Welcome ${session.username} til vår ${session}!`);
    console.log(`Er ${session.telefonnr} riktig ?`);
    if (b.playersConnected === b.max_players) {
        inResponse.status(503).send('Too many players connected.');
        return;
    }
    b.incPlayersConnected = 1;
    if (b.playersConnected === 4)
        //b = new BridgeBord();
        b.nullstill();
    try {
        b.spillere.push(new Spiller_1.Spiller(session.username, b));
        console.log("POST /ta-plass: Ok");
        inResponse.send("<html><head></head><body></body></html>");
    }
    catch (inError) {
        console.log("POST /ta-plass: Error", inError);
        inResponse.send("error");
    }
}));
app.get('/ready', (req, res) => {
    b.playersReady++;
    let shuffledDeck;
    let dealtDeck;
    console.log("Players ready: " + b.playersReady + " AND SIGNED UP " + b.playersConnected);
    if (b.playersReady === b.playersConnected) {
        b.myDeck = Utils.getDeck();
        shuffledDeck = b.spillere[b.current_dealer].shuffle_cards(b.myDeck);
        try {
            dealtDeck = b.spillere[b.current_dealer].deal_cards(shuffledDeck);
            //console.log('Dette er ' + Plass.North + ' sine kort'); printDeck(
            b.spillere[Bord_1.Plass.North].pick_up_cards(dealtDeck[Bord_1.Plass.North] //)
            );
            //console.log('Dette er ' + Plass.East + ' sine kort'); printDeck(
            b.spillere[Bord_1.Plass.East].pick_up_cards(dealtDeck[Bord_1.Plass.East] //)
            );
            //console.log('Dette er ' + Plass.South + ' sine kort'); printDeck(
            b.spillere[Bord_1.Plass.South].pick_up_cards(dealtDeck[Bord_1.Plass.South] //)
            );
            //console.log('Dette er ' + Plass.West + ' sine kort'); printDeck(
            b.spillere[Bord_1.Plass.West].pick_up_cards(dealtDeck[Bord_1.Plass.West] //)
            );
            const html_output = Utils.renderDeck(Bord_1.Plass.North, dealtDeck, b);
            console.log("Vi har nok spillere nå");
            res.send(html_output);
        }
        catch (e) {
            console.log(e);
        }
        b.playersReady = 0;
    }
    else {
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
        b.siste_i_boksen = { plass: b.current_bidder, melding: b.siste_melding };
    }
    let tekst_melding = Utils.melding2string(siste_m);
    let melding = b.plass2String(b.current_bidder) + " melder " + tekst_melding + " med "
        + b.spillere[b.current_bidder].poeng + " poeng ";
    if (b.no_pass < 4) {
        b.nestemelder();
        res.send(`<html><head></head><body> ${melding} </body></html>`);
    }
    else {
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
