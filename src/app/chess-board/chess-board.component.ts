import {Component} from '@angular/core';
import {Piece} from "../piece";
import {ChessService} from "../chess.service";

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent {

  constructor(private chessService: ChessService) {
  }

  public get Piece(): typeof Piece {
    return Piece;
  }

  onMouseDown(id: number) {
    this.chessService.onMouseDown(id);
  }

  onMouseUp(id: number) {
    this.chessService.onMouseUp(id);
  }

  getValidMoves() {
    return this.chessService.validMoves;
  }

  getBoard() {
    return this.chessService.board;
  }

}
