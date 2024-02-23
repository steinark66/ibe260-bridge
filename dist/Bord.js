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
exports.b = exports.BridgeBord = exports.KortBord = exports.Plass = void 0;
const Spiller_1 = require("./Spiller");
const Utils = __importStar(require("./Utils"));
var Plass;
(function (Plass) {
    Plass[Plass["North"] = 0] = "North";
    Plass[Plass["East"] = 1] = "East";
    Plass[Plass["South"] = 2] = "South";
    Plass[Plass["West"] = 3] = "West";
})(Plass || (exports.Plass = Plass = {}));
;
class KortBord {
    constructor() {
        this.spillere = [];
        this.deck = Utils.getDeck();
        this.no_pass = 0;
        this.playersReady = 0;
        this._playersConnected = 0;
        this.current_dealer = Plass.North;
        this.current_bidder = Plass.North;
    }
    nestespill() {
        if (this.current_dealer < Plass.West)
            this.current_dealer++;
        else
            this.current_dealer = Plass.North;
    }
    nestemelder() {
        if (this.current_bidder < Plass.West)
            this.current_bidder++;
        else
            this.current_bidder = Plass.North;
    }
    nullstill() {
        //this._playersConnected = 0; 
        this.current_dealer = Plass.North;
        this.current_bidder = Plass.North;
        this.playersReady = 0;
        this.no_pass = 0;
    }
    get playersConnected() {
        //console.log("Players connected: " + this._playersConnected); 
        return this._playersConnected;
    }
    set incPlayersConnected(n) {
        this._playersConnected += n;
        console.log('Inc to ${this._playersConnected}');
    }
    get myDeck() {
        return this.deck;
    }
    set myDeck(d) {
        this.deck = d;
    }
}
exports.KortBord = KortBord;
class BridgeBord extends KortBord {
    constructor() {
        super();
        //private _no_of_players = 0; 
        this._max_players = 4;
        this.siste_melding = { niva: 0, suit: "" };
        this.siste_i_boksen = { plass: Plass.North, melding: this.siste_melding };
        this.spillere = [
            new Spiller_1.Spiller(Plass.North),
            new Spiller_1.Spiller(Plass.East),
            new Spiller_1.Spiller(Plass.South),
            new Spiller_1.Spiller(Plass.West)
        ];
    }
    get max_players() {
        return this._max_players;
    }
    plass2String(p) {
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
exports.BridgeBord = BridgeBord;
exports.b = new BridgeBord();
