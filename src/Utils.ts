import {SessionData, Card} from "./typings/express-session/index";
import { KortBord, BridgeBord, Plass } from './Bord'; 

var suits = ["spar", "ruter", "klver", "hjerter"];
var values = [2,3,4,5,6,7,8,9,10,11,12,13,14];


const crypto = require('crypto');

// Velg ønsket lengde på secret-strengen
const length = 16;
// Generer en unik streng med tilfeldige tall
export const randomBytes = crypto.randomBytes(length);


export  function printDeck(deck: Card[])
{
  //console.log(`Kortstokken inneholder ${deck.length} kort!`)
	for(let i = 0; i < deck.length; i++)
	{
    
      ; //console.log(`Farge: ${deck[i].suit} og valør ${deck[i].rank}. `);
		
	}

	return deck;
}

export function getDeck()
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


export function renderDeck(pl: Plass, deck: Card[], b: BridgeBord): string
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

  const html_body = render_body(pl, deck, b); 

    const html_slutt = `
      </body>
    </html>
    `;

    return html_start + html_body + html_slutt; 
}

function render_body(pl: Plass, deck: Card[][], b: BridgeBord): string {
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
  return divs + render_body(pl + 1, deck, b); 
    else
  return divs + "\n"; 
};


export type SuitPreference = {
    [key: string]: number;
};
  
export interface SuitCount {
    [key: string]: number;
}; 
  
export type Melding = {niva: number, suit: string}; 
  
  export type Meldeboks = {
    plass: Plass, melding: Melding
};

  
  interface Runde {
  
  }
  
  interface Utgang {
    
  }
  
  interface Robber {
    
  }
  
  let hands: Card[][]; 
  

  export function melding2string(m: Melding): string {
    return m.niva + " " + m.suit;  
  }

  export function lower_than(m: Melding, n: Melding): boolean {
    console.log(`Sjekker om ${m.niva} ${m.suit} er lavere enn ${n.niva} ${n.suit} `); 

    if (m.niva < n.niva) {
        console.log(true); 
        return true;
    }
    if (m.niva > n.niva) {
        console.log(false);
        return false;
    }
    if (m.suit === 'NT') {
      console.log ("(m.suit === 'NT')");  
      console.log ("n.suit er derimot " + n.suit );   
      console.log(n.suit === 'NT');   
      return n.suit === 'NT';

    } else {
      const suits = ['klver', 'ruter', 'hjerter', 'spar'];
      const mSuitIndex = suits.indexOf(m.suit);
      const nSuitIndex = suits.indexOf(n.suit);
      console.log(mSuitIndex < nSuitIndex); 
      return mSuitIndex < nSuitIndex;
    }
  
}
  
