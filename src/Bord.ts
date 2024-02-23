import {Spiller} from "./Spiller";
import * as Utils from "./Utils";
import {SessionData, Card} from "./typings/express-session/index";
export enum Plass {North, East, South, West}; 


export interface KortBordIF {
  spillere: Spiller[]; 
  _playersConnected: number; 

}

export class KortBord implements KortBordIF {
  _playersConnected: number; 
  spillere: Spiller[] = []; 
  deck = Utils.getDeck(); 
  no_pass: number = 0; 
  playersReady: number = 0;  

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
    this.playersReady = 0; 
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

export class BridgeBord extends KortBord {
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


  siste_melding : Utils.Melding = {niva: 0, suit: ""}; 
  siste_i_boksen : Utils.Meldeboks = {plass: Plass.North, melding: this.siste_melding}; 


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

export const b: BridgeBord = new BridgeBord(); 