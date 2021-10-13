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

  @Input() board: number[] = new Array(64).fill(0);

  private fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
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
    for(let i = 0; i < this.fen.length; i++){
      let c = this.fen.charAt(i);
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
}
