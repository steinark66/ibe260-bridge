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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeBord = exports.KortBord = exports.Plass = void 0;
// Importerer alt fra "./Utils" modulen og gir det et alias "Utils"
// Obs. Det betyr et par-tre ting, som jeg må fikse på:
// -ikke alt bør vær der, og skal flyttes til de domenespesifikke klassene
// -det som skal brukes må prefikses med Utils
// .en del ting importeres på kryss og tvers, det er ikke bra
const Utils = __importStar(require("./Utils"));
// Eksporterer en liste-type (enum) Plass med verdiene "North", "East", "South" og "West"
var Plass;
(function (Plass) {
    Plass[Plass["North"] = 0] = "North";
    Plass[Plass["East"] = 1] = "East";
    Plass[Plass["South"] = 2] = "South";
    Plass[Plass["West"] = 3] = "West";
})(Plass || (exports.Plass = Plass = {}));
;
// Eksporterer en klasse KortBord som implementerer KortBordIF
class KortBord {
    constructor() {
        // Re-deklarerer en attributt "_playersConnected" av typen number
        this._playersConnected = 0;
        // Deklarerer en attributt "spillere" av typen Spiller[] og setter den til en tom array
        this.spillere = [];
        // Deklarerer en attributt "deck" og initialiserer den til en kortstokk - som ikke er stokket ennå
        this.deck = Utils.getDeck();
        // Deklarerer en attributt "playersReady" og setter den til 0
        this.playersReady = 0;
    }
    // En get-metode som returnerer verdien av "_playersConnected"
    get playersConnected() {
        return this._playersConnected;
    }
    // En set-metode som inkrementerer "_playersConnected" med gitt verdi "n" og skriver ut en logg
    set incPlayersConnected(n) {
        this._playersConnected += n;
        //console.log('Inc to ${this._playersConnected}'); 
    }
    // En get-metode som returnerer verdien av "deck"
    get myDeck() {
        return this.deck;
    }
    // En set-metode som oppdaterer verdien av "deck" med input "d"
    set myDeck(d) {
        this.deck = d;
    }
}
exports.KortBord = KortBord;
// Eksporterer en klasse BridgeBord som utvider KortBord
class BridgeBord extends KortBord {
    // Konstruktør som kaller super() fra KortBord og initialiserer attributtet "spillere"
    constructor() {
        super();
        // Deklarerer en privat attributt "_max_players" og setter den til 4
        this._max_players = 4;
        // Deklarerer en attributt "no_pass" og setter den til 0, skjermer den, slik at vi vet hvordan den endres
        this._no_pass = 0;
        // Deklarerer attributtene "siste_melding" og "siste_i_boksen" med deres respektive typer og initialverdier
        this.siste_melding = { niva: 0, suit: "" };
        this.siste_i_boksen = { plass: Plass.North, melding: this.siste_melding };
        this.spillere = [
        /*
        new Spiller(Plass.North),
        new Spiller(Plass.East),
        new Spiller(Plass.South),
        new Spiller(Plass.West)
        */
        ];
        this._playersConnected = 0;
        this._current_dealer = Plass.North;
        this._current_bidder = Plass.North;
    }
    get current_bidder() {
        return this._current_bidder;
    }
    get current_dealer() {
        return this._current_dealer;
    }
    // En metode som oppdaterer "current_dealer" med neste spiller basert på verdien av current_dealer
    nestespill() {
        if (this._current_dealer < Plass.West)
            this._current_dealer++;
        else
            this._current_dealer = Plass.North;
        this._no_pass = 0;
    }
    // En metode som oppdaterer "current_bidder" med neste spiller basert på verdien av current_bid
    nestemelder() {
        if (this._current_bidder < Plass.West)
            this._current_bidder++;
        else
            this._current_bidder = Plass.North;
    }
    // En metode som nullstiller relevante attributter slik at vi kan begynne på et nytt spill
    nullstill() {
        this._current_dealer = Plass.North;
        //this.current_bidder = Plass.North;
        this.playersReady = 0;
        this._no_pass = 0;
        this.siste_melding = { niva: 0, suit: "" };
        this.siste_i_boksen = { plass: Plass.North, melding: this.siste_melding };
    }
    get no_pass() {
        return this._no_pass;
    }
    set no_pass(nop) {
        this._no_pass = nop;
    }
    // En get-metode som returnerer verdien av "_max_players"
    get max_players() {
        return this._max_players;
    }
    // Metode som mapper liste-verdien til en lesbar tekst
    // Dette må da kunne gjøres mer elegant?
    plass2String(p) {
        switch (p) {
            case Plass.North:
                return "Nord";
            case Plass.East:
                return "Øst";
            case Plass.South:
                return "Syd";
            case Plass.West:
                return "Vest";
            default:
                return "Stolleken";
        }
    }
}
exports.BridgeBord = BridgeBord;
