import {SessionData, Card} from "./typings/express-session/index";
import { KortBord, BridgeBord, Plass } from './Bord'; 
import * as Utils from './Utils'; 

export interface SpillerIF {
    secret: string; 
    pos: Plass; 
    my_cards: Array<Card>; 
  
    receive_cards(cards: Array<Card>): Array<Card>;
    shuffle_cards(cards: Array<Card>): Array<Card>;
    pick_up_cards(cards: Array<Card>): Array<Card>;
    deal_cards(cards: Array<Card>): Array<Card>; 
  
}

export class Spiller implements SpillerIF {
  secret: string; 
  pos: Plass; 
  my_cards: Array<Card>; 
  private _poeng: number = 0; 
  bord: BridgeBord;  

  constructor(pos: Plass, bbord: BridgeBord ) {
    this.secret = Utils.randomBytes.toString('hex');
    this.pos = pos; 
    this.my_cards = []; 
    this.bord = bbord; 
  }

  get poeng() {
    return this._poeng;
  }

  set poeng(p: number) {
    this._poeng = p; 
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


  tellPoengOgMeld = (cardio?: Card[]): Utils.Melding => {
    let points = 0;
    let suits: Utils.SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 

    console.log("Vi har " + this.bord.no_pass + " som har passet til nå"); 
    console.log("Siste melding var fra " + this.bord.siste_i_boksen.plass + " : " + this.bord.siste_i_boksen.melding.niva + " " + this.bord.siste_i_boksen.melding.suit); 

    if (this.bord.no_pass >= 3) 
    {
      this.bord.no_pass += 1; 
      return {niva: 0, suit: "Pass"}; 
    }

    if (this.bord.siste_i_boksen.melding.niva === 0) //Åpningsmelding
      return this.opening_tellPoengOgMeld(cards); 
    else if (!this.bord.spillere[this.bord.current_bidder].min_makker(this.bord.siste_i_boksen.plass)) //defensiv melding
      return this.defensiv_tellPoengOgMeld(cards);  
    else //egentlig unødvendig test, må være makker som har meldt - eller jeg selv? 
        if (!this.bord.spillere[this.bord.current_bidder].min_makker(this.bord.siste_i_boksen.plass)) //støttemelding
      return this.support_tellPoengOgMeld(cards);
    else {
      this.bord.no_pass += 1; 
      return {niva: 0, suit: "Pass"}; 
    }
    //Vi har gått runden?  
  }

  opening_tellPoengOgMeld = (cardio?: Card[]): Utils.Melding => {
    let points = 0;
    let suits: Utils.SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 

    console.log("Opening"); 

    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let rank = card.rank;
      let suit = card.suit;
  
      // Tell poengene for honnørkortene, hvor ess = 4, konge = 3, dame = 2 og knekt = 1
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
  
    /* Legg til poeng for langfarger basert på reglene for naturlig system eller Goren-Cubertson
    let fordelingspoeng = 0; 
    fordelingspoeng += (suits['spar'] >= 5) ? suits['spar'] - 4 : 0;
    fordelingspoeng += (suits['hjerter'] >= 5) ? suits['hjerter'] - 4 : 0;
    fordelingspoeng += (suits['ruter'] >= 5) ? suits['ruter'] - 4 : 0;
    fordelingspoeng += (suits['klver'] >= 5) ? suits['klver'] - 4 : 0;
    */

    //Lettere å lese det slik:
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

    this._poeng = points;  

    // Bestem åpningsmeldingen basert på poengsummen
    
    if (points >= 13) {

      if (points >= 16) {
        this.bord.no_pass = 0; //bør egentlig bare få "lage" meldinger et sted der dette skjer automatisk
        return  {niva: 1, suit: 'NT'};  //'1 NT';
      }

      /*
      let longestSuit = Object.keys(suits).reduce((a,b) => suits[a] > suits[b] ? a : b);
      */
      // Løkke med "for" gjør det samme, men enklere på lese
      for (const suit of Object.keys(suits)) {
        if (suits[suit] > longestLengde) {
          longestLengde = suits[suit]; 
          longestSuit = suit; 
        }
      }
      console.log(`Poeng på hånda: ${points}!`); 
      this.bord.no_pass = 0; 
      return {niva: 1, suit: longestSuit}; // `1 ${longestSuit}`;
    }
    console.log(`Poeng på hånda: ${points}!`); 
    this.bord.no_pass += 1; 
    return {niva: 0, suit: 'Pass'}; //'Pass';
  };
  

  
  defensiv_tellPoengOgMeld = (cardio?: Card[]): Utils.Melding => {
    let points = 0;
    let suits: Utils.SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 

    console.log("Defensivt"); 

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
    this._poeng = points; 

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
      if (this.bord.siste_i_boksen.melding.niva < 3) {
        if (Utils.lower_than(this.bord.siste_i_boksen.melding, {niva: 1, suit: longestSuit}))
        { 
          this.bord.no_pass = 0; 
          return {niva: 1, suit: longestSuit}; 
        }
        else if (Utils.lower_than(this.bord.siste_i_boksen.melding, {niva: 2, suit: longestSuit}))
        {
          this.bord.no_pass = 0; 
          return {niva: 2, suit: longestSuit}
        }
        else {
          this.bord.no_pass += 1;
          return {niva: 0, suit: 'Pass'};
        } 
      } 
      else {
        this.bord.no_pass += 1;
        return {niva: 0, suit: 'Pass'}; //'Pass'; 
      }
      this.bord.no_pass = 0; 
      return {niva: 1, suit: longestSuit}; // `1 ${longestSuit}`;
    }
    console.log(`Poeng på hånda: ${points}!`); 
    this.bord.no_pass += 1; 
    return {niva: 0, suit: 'Pass'}; //'Pass';
  };


  support_tellPoengOgMeld = (cardio?: Card[]): Utils.Melding => {
    let points = 0;
    let suits: Utils.SuitCount = {};
    let cards = []; 
    let longestSuit = "";
    let longestLengde = 0; 
    let level = 0; 
    if (cardio)
      cards = cardio;
    else cards = this.my_cards; 

    console.log("Støtte"); 

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
    this._poeng = points; 

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
      let ny_melding = {niva: this.bord.siste_i_boksen.melding.niva, suit: longestSuit}; 
      console.log(`Sjekker om ${this.bord.siste_i_boksen.melding} er lavere enn ${ny_melding}`);

      if (Utils.lower_than(this.bord.siste_i_boksen.melding, ny_melding))
      {
        this.bord.no_pass = 0; 
        return ny_melding; 
      }
      else
      {
        this.bord.no_pass = 0; 
        return {niva: this.bord.siste_i_boksen.melding.niva+1, suit: longestSuit}
      }
    }
    else if (points > 6) //støtt så forsiktig som mulig, samme farge som makker
    {
      this.bord.no_pass = 0;   
      return {niva: this.bord.siste_i_boksen.melding.niva+1, suit: this.bord.siste_i_boksen.melding.suit}; 
    }
    //eller i verste fall
    this.bord.no_pass += 1;  
    return {niva: 0, suit: 'Pass'}; //'Pass';
  
  };



  suitsOrder: Utils.SuitPreference = {
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
    Utils.printDeck(this.my_cards); 
    return this.my_cards; 
  }

  deal_cards(deck: Card[]): Card[][] {

    const hands: Card[][] = [[], [], [], []];

    //console.log("Får en kortstokk med " + deck.length + " kort"); 
    //console.log("Skal fordeles på " + this.bord.playersConnected + " spillere"); 
   
    let kort_til_hver = deck.length / this.bord.playersConnected; 
    //console.log("Kort til hver " + kort_til_hver); 


    for (let i = 0; i < kort_til_hver; i++) {
      //console.log("i: " + i);
      for (let j = 0; j < this.bord.playersConnected; j++) {
        //console.log("j: " + j);
        hands[j][i] = deck.pop();
      }
    }
    return hands;
  }

} 
