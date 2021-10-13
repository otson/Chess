import {Component, Input, OnInit} from '@angular/core';
import {Piece} from "../piece";


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

  ngOnInit(): void {
    this.board[5] = Piece.King * Piece.Black;
    this.board[6] = Piece.King * Piece.White;
    this.board[23] = Piece.Rook * Piece.Black;
    this.board[45] = Piece.Queen * Piece.White;
  }
}
