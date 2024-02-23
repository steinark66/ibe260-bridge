// Importerer Spiller fra "./Spiller" modulen
import {Spiller} from "./Spiller";
// Importerer alt fra "./Utils" modulen og gir det et alias "Utils"
// Obs. Det betyr et par-tre ting, som jeg må fikse på:
// -ikke alt bør vær der, og skal flyttes til de domenespesifikke klassene
// -det som skal brukes må prefikses med Utils
// .en del ting importeres på kryss og tvers, det er ikke bra
import * as Utils from "./Utils";
// Importerer SessionData og Card fra "./typings/express-session/index" modulen
import {SessionData, Card} from "./typings/express-session/index";

// Eksporterer en liste-type (enum) Plass med verdiene "North", "East", "South" og "West"
export enum Plass {North, East, South, West}; 

// Skal bruke et grensesnitt KortBordIF, trenger vel ikke å eksportere det? 
interface KortBordIF {
  // Deklarerer en attributt "spillere" av typen Spiller[]
  spillere: Spiller[]; 
  // Deklarerer en attributt "_playersConnected" av typen number
  _playersConnected: number; 
  // den skal skjermes - og det bør jeg gjøre med mange flere atributter også
}

// Eksporterer en klasse KortBord som implementerer KortBordIF
export class KortBord implements KortBordIF {
  // Re-deklarerer en attributt "_playersConnected" av typen number
  _playersConnected: number = 0; 
  // Deklarerer en attributt "spillere" av typen Spiller[] og setter den til en tom array
  spillere: Spiller[] = []; 
  // Deklarerer en attributt "deck" og initialiserer den til en kortstokk - som ikke er stokket ennå
  deck = Utils.getDeck(); 

  // Deklarerer en attributt "playersReady" og setter den til 0
  playersReady: number = 0;  



  // En get-metode som returnerer verdien av "_playersConnected"
  get playersConnected(): number {
    return this._playersConnected; 
  }
  
  // En set-metode som inkrementerer "_playersConnected" med gitt verdi "n" og skriver ut en logg
  public set incPlayersConnected(n: number) {
    this._playersConnected += n;  
    //console.log('Inc to ${this._playersConnected}'); 
  }

  // En get-metode som returnerer verdien av "deck"
  get myDeck() {
    return this.deck;
  }

  // En set-metode som oppdaterer verdien av "deck" med input "d"
  set myDeck(d: Card[]) {
    this.deck= d; 
  }
}

// Eksporterer en klasse BridgeBord som utvider KortBord
export class BridgeBord extends KortBord {
  // Deklarerer en privat attributt "_max_players" og setter den til 4
  private _max_players = 4;  
  // Deklarerer en attributt "no_pass" og setter den til 0, skjermer den, slik at vi vet hvordan den endres
  private _no_pass: number = 0; 
  
  // Konstruktør som kaller super() fra KortBord og initialiserer attributtet "spillere"
  constructor()  {
    super(); 
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

    // Deklarerer attributtene "current_dealer" og "current_bidder" av typen Plass
    private _current_dealer: Plass; 
    private _current_bidder: Plass; 


    get current_bidder () {
        return this._current_bidder; 
    }
  
    get current_dealer () {
        return this._current_dealer; 
    }

    // En metode som oppdaterer "current_dealer" med neste spiller basert på verdien av current_dealer
    nestespill() {
      if (this._current_dealer < Plass.West)
        this._current_dealer++; 
      else this._current_dealer = Plass.North; 
      this._no_pass = 0; 
    }
  
    // En metode som oppdaterer "current_bidder" med neste spiller basert på verdien av current_bid
    nestemelder() {
      if (this._current_bidder < Plass.West)
        this._current_bidder++; 
      else this._current_bidder = Plass.North; 
    }
  
    // En metode som nullstiller relevante attributter slik at vi kan begynne på et nytt spill
    nullstill() {
      this._current_dealer = Plass.North;
      //this.current_bidder = Plass.North;
      this.playersReady = 0; 
      this._no_pass = 0; 
      this.siste_melding = {niva: 0, suit: ""}; 
      this.siste_i_boksen = {plass: Plass.North, melding: this.siste_melding};
    }

  get no_pass() {
    return this._no_pass;
  }

  set no_pass(nop: number) {
    this._no_pass = nop; 
  }

  // En get-metode som returnerer verdien av "_max_players"
  get max_players() {
    return this._max_players; 
  }

  // Deklarerer attributtene "siste_melding" og "siste_i_boksen" med deres respektive typer og initialverdier
  siste_melding : Utils.Melding = {niva: 0, suit: ""}; 
  siste_i_boksen : Utils.Meldeboks = {plass: Plass.North, melding: this.siste_melding}; 

  // Metode som mapper liste-verdien til en lesbar tekst
  // Dette må da kunne gjøres mer elegant?
  plass2String(p: Plass): string {
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
