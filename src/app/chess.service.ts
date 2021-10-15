import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  messages: string[] = ['Welcome to play chess! Move pieces by dragging them with a mouse.', "It's now White's turn."];
  isPlaying: boolean = true;
  isWhitesTurn = true;

  constructor() { }

  setGameEnded(oldPiece: number) {
    this.addMessage(oldPiece > 0 ? 'Black' : 'White' + ' wins!');
    this.isPlaying = false;
  }

  switchTurn(){
    if(!this.isPlaying) return;
    this.isWhitesTurn = !this.isWhitesTurn;
    this.addMessage("It's now "+ (this.isWhitesTurn ? 'White' : 'Black')+"'s turn.");
  }

  private addMessage(message: string){
    this.messages.push(message);
    this.messages = this.messages.slice(-3);
  }
}
