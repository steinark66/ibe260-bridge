"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDeck = exports.getDeck = exports.printDeck = exports.randomBytes = void 0;
const Bord_1 = require("./Bord");
var suits = ["spar", "ruter", "klver", "hjerter"];
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const crypto = require('crypto');
// Velg ønsket lengde på secret-strengen
const length = 16;
// Generer en unik streng med tilfeldige tall
exports.randomBytes = crypto.randomBytes(length);
function printDeck(deck) {
    console.log(`Kortstokken inneholder ${deck.length} kort!`);
    for (let i = 0; i < deck.length; i++) {
        console.log(`Farge: ${deck[i].suit} og valør ${deck[i].rank}. `);
    }
    return deck;
}
exports.printDeck = printDeck;
function getDeck() {
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            let card = { suit: suits[i], rank: values[x], };
            deck.push(card);
            //console.log(`Farge: ${card.suit} og valør ${card.rank}. `);
        }
    }
    return deck;
}
exports.getDeck = getDeck;
function renderDeck(pl, deck) {
    //gjenskap denne i enkel HTML
    //printDeck(b.spillere[Plass.North].pick_up_cards(dealtDeck[Plass.North])); 
    //document.getElementById("deck").innerHTML = "";
    // Definer innholdet i HTML-siden
    const h1 = "<h1>Kortene som er gitt</h1>";
    const h2s = ["<h2>Spiller " + pl + " </h2>"]; //, "<h2>Linje 2</h2>", "<h2>Linje 3</h2>"];
    const divs = ["<div>Kortene usortert:</div>"]; // , "<div>Div 2</div>", "<div>Div 3</div>"];
    // Bygg opp HTML-siden ved hjelp av template literals
    const html_start = `
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
exports.renderDeck = renderDeck;
function render_body(pl, deck) {
    let divs = "<div> \n " + `Spiller ${Bord_1.b.plass2String(pl)} har fått følgende kort: \n`;
    //console.log(`render for ${plass2String(pl)} og ${deck[pl].length}`); 
    divs += "<ul>";
    for (let i = 0; i < deck[pl].length; i++) {
        //console.log(`Farge: ${deck[pl][i].suit} og valør ${deck[pl][i].rank}. `);
        divs += "<li>\n";
        divs = divs + `Farge: ${deck[pl][i].suit} og valør ${deck[pl][i].rank}. \n`;
        divs += "</li>\n";
        //console.log(divs); 
    }
    divs += "</ul>";
    divs = divs + "\n </div>";
    if (pl < Bord_1.Plass.West)
        return divs + render_body(pl + 1, deck);
    else
        return divs + "\n";
}
;
;
let hands;
