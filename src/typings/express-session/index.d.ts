// ./src/typings/express-session/index.d.ts
import "express-session"; // tar med den opprinnelige modulen
export {SessionData, Card}

declare module "express-session" {

interface Card { //samler alt dette i en gen fil etterhvert
    suit: string;
    rank: number;
  }



    interface SessionData {
        username: string; // bli litt bedre kjent. 
        telefonnr: string; 
        points: number; 
        cards: Card[];
    }
}