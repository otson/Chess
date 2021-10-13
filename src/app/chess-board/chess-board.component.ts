import {Component, Input, OnInit} from '@angular/core';
import {Piece} from "../piece";
import {isDigit} from "@angular/compiler/src/chars";


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  public get Piece(): typeof Piece {
    return Piece;
  }
  dragging: boolean  = false;
  startId: number = -1;
  @Input() board: number[] = new Array(64).fill(0);

  private fenStart = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  private fen2 = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2 '
  private pieceFromSymbol = new Map([
    ['k',Piece.King],
    ['p',Piece.Pawn],
    ['n',Piece.Knight],
    ['b',Piece.Bishop],
    ['r',Piece.Rook],
    ['q',Piece.Queen],
  ])

  ngOnInit(): void {
    function isCharNumber(c: string) {
      return c >= '0' && c <= '9';
    }
    let rank = 7;
    let file = 0;
    for(let i = 0; i < this.fen2.length; i++){
      let c = this.fen2.charAt(i);
      if(c == ' ') break;
      if(c == '/'){
        file = 0;
        rank--;
      } else {
        if(isCharNumber(c)){
          file += Number.parseInt(c);
        } else {
          let color = (c === c.toUpperCase()) ? Piece.Black : Piece.White;
          let piece = this.pieceFromSymbol.get(c.toLowerCase())!;
          this.board[rank * 8 + file] = color * piece;
          file++;
        }
      }
    }
  }

  onMouseDown(id: number, event: MouseEvent) {
    console.log("Mouse down in ", id);
    this.dragging = true;
    this.startId = id;
    event.preventDefault();
  }

  onMouseUp(id: number) {
    console.log("Mouse up in ", id);
    if(this.startId != -1){
      console.log("swapping");
      let temp = this.board[this.startId];
      this.board[this.startId] = this.board[id];
      this.board[id] = temp;
    }
    this.startId = -1;
    this.dragging = false;
  }
}
