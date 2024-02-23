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
exports.Spiller = void 0;
const Bord_1 = require("./Bord");
const Utils = __importStar(require("./Utils"));
class Spiller {
    constructor(pos) {
        this.tellPoengOgMeld = (cardio) => {
            let points = 0;
            let suits = {};
            let cards = [];
            let longestSuit = "";
            let longestLengde = 0;
            let level = 0;
            if (cardio)
                cards = cardio;
            else
                cards = this.my_cards;
            console.log("Vi har " + Bord_1.b.no_pass + " som har passet");
            if (Bord_1.b.no_pass >= 3) {
                Bord_1.b.no_pass++;
                return { niva: 0, suit: "Pass" };
            }
            if (Bord_1.b.siste_i_boksen.melding.niva === 0) //Åpningsmelding
                return this.opening_tellPoengOgMeld(cards);
            else if (!Bord_1.b.spillere[Bord_1.b.current_bidder].min_makker(Bord_1.b.siste_i_boksen.plass)) //defensiv melding
                return this.defensiv_tellPoengOgMeld(cards);
            else //egentlig unødvendig test, må være makker som har meldt - eller jeg selv? 
             if (!Bord_1.b.spillere[Bord_1.b.current_bidder].min_makker(Bord_1.b.siste_i_boksen.plass)) //støttemelding
                return this.support_tellPoengOgMeld(cards);
            else {
                Bord_1.b.no_pass++;
                return { niva: 0, suit: "Pass" };
            }
            //Vi har gått runden?  
        };
        this.opening_tellPoengOgMeld = (cardio) => {
            let points = 0;
            let suits = {};
            let cards = [];
            let longestSuit = "";
            let longestLengde = 0;
            let level = 0;
            if (cardio)
                cards = cardio;
            else
                cards = this.my_cards;
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
                }
                else {
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
                    fpo += 3;
                else if (suits[key] === 1)
                    fpo += 2;
                else if (suits[key] === 2)
                    fpo += 1;
                //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
            });
            points += fpo;
            // Bestem åpningsmeldingen basert på poengsummen
            if (points >= 13) {
                if (points >= 16) {
                    return { niva: 1, suit: 'NT' }; //'1 NT';
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
                return { niva: 1, suit: longestSuit }; // `1 ${longestSuit}`;
            }
            console.log(`Poeng på hånda: ${points}!`);
            Bord_1.b.no_pass++;
            return { niva: 0, suit: 'Pass' }; //'Pass';
        };
        this.lower_than = (m, n) => {
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
            else
                return true; //
        };
        this.defensiv_tellPoengOgMeld = (cardio) => {
            let points = 0;
            let suits = {};
            let cards = [];
            let longestSuit = "";
            let longestLengde = 0;
            let level = 0;
            if (cardio)
                cards = cardio;
            else
                cards = this.my_cards;
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
                }
                else {
                    suits[suit] = 1;
                }
            }
            let fpo = 0;
            Object.keys(suits).forEach((key) => {
                if (suits[key] === 0)
                    fpo += 3;
                else if (suits[key] === 1)
                    fpo += 2;
                else if (suits[key] === 2)
                    fpo += 1;
            });
            points += fpo;
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
                if (Bord_1.b.siste_i_boksen.melding.niva < 3) {
                    if (this.lower_than(Bord_1.b.siste_i_boksen.melding, { niva: 1, suit: longestSuit }))
                        return { niva: 1, suit: longestSuit };
                    else if (this.lower_than(Bord_1.b.siste_i_boksen.melding, { niva: 2, suit: longestSuit }))
                        return { niva: 2, suit: longestSuit };
                    else {
                        Bord_1.b.no_pass++;
                        return { niva: 0, suit: 'Pass' };
                    }
                }
                else {
                    Bord_1.b.no_pass++;
                    return { niva: 0, suit: 'Pass' }; //'Pass'; 
                }
                return { niva: 1, suit: longestSuit }; // `1 ${longestSuit}`;
            }
            console.log(`Poeng på hånda: ${points}!`);
            Bord_1.b.no_pass++;
            return { niva: 0, suit: 'Pass' }; //'Pass';
        };
        this.support_tellPoengOgMeld = (cardio) => {
            let points = 0;
            let suits = {};
            let cards = [];
            let longestSuit = "";
            let longestLengde = 0;
            let level = 0;
            if (cardio)
                cards = cardio;
            else
                cards = this.my_cards;
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
                }
                else {
                    suits[suit] = 1;
                }
            }
            let fpo = 0;
            Object.keys(suits).forEach((key) => {
                if (suits[key] === 0)
                    fpo += 3;
                else if (suits[key] === 1)
                    fpo += 2;
                else if (suits[key] === 2)
                    fpo += 1;
                //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
            });
            points += fpo;
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
                if (this.lower_than(Bord_1.b.siste_i_boksen.melding, { niva: Bord_1.b.siste_i_boksen.melding.niva, suit: longestSuit }))
                    return { niva: Bord_1.b.siste_i_boksen.melding.niva, suit: longestSuit };
                else
                    return { niva: Bord_1.b.siste_i_boksen.melding.niva + 1, suit: longestSuit };
            }
            else if (points > 6) //støtt så forsiktig som mulig, farge som makker
                return { niva: Bord_1.b.siste_i_boksen.melding.niva + 1, suit: Bord_1.b.siste_i_boksen.melding.suit };
            //eller i verste fall
            Bord_1.b.no_pass++;
            return { niva: 0, suit: 'Pass' }; //'Pass';
        };
        this.suitsOrder = {
            'spar': 0,
            'hjerter': 1,
            'ruter': 2,
            'klver': 3
        };
        this.secret = Utils.randomBytes.toString('hex');
        this.pos = pos;
        this.my_cards = [];
    }
    receive_cards(cards) {
        this.my_cards = cards;
        return this.my_cards;
    }
    shuffle_cards(cards) {
        // Fisher-Yates algorithm for å stokke korten helt rettferdig
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
    min_makker(l) {
        if (this.pos === l)
            return false;
        if ((this.pos === Bord_1.Plass.North && l === Bord_1.Plass.South) || (l === Bord_1.Plass.North && this.pos === Bord_1.Plass.South))
            return true;
        if ((this.pos === Bord_1.Plass.East && l === Bord_1.Plass.West) || (l === Bord_1.Plass.East && this.pos === Bord_1.Plass.West))
            return true;
        return false;
    }
    melding2string(m) {
        return m.niva + m.suit;
    }
    sort_cards(cards) {
        return cards.sort((a, b) => {
            // Sorter etter farge
            if (this.suitsOrder[a.suit] < this.suitsOrder[b.suit]) {
                return -1;
            }
            else if (this.suitsOrder[a.suit] > this.suitsOrder[b.suit]) {
                return 1;
            }
            else {
                // Hvis fargene er de samme, sorter etter verdi
                if (a.rank < b.rank) {
                    return -1;
                }
                else if (a.rank > b.rank) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        });
    }
    pick_up_cards(cards) {
        this.my_cards = this.sort_cards(cards);
        Utils.printDeck(this.my_cards);
        return this.my_cards;
    }
    deal_cards(deck) {
        const hands = [[], [], [], []];
        console.log("Får en kortstokk med " + deck.length + " kort");
        console.log("Skal fordeles på " + Bord_1.b.playersConnected + " spillere");
        let kort_til_hver = deck.length / Bord_1.b.playersConnected;
        console.log("Kort til hver " + kort_til_hver);
        for (let i = 0; i < kort_til_hver; i++) {
            console.log("i: " + i);
            for (let j = 0; j < Bord_1.b.playersConnected; j++) {
                console.log("j: " + j);
                hands[j][i] = deck.pop();
            }
        }
        return hands;
    }
}
exports.Spiller = Spiller;
