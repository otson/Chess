import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  @Input() board: number[] = new Array(64).fill(0);

  ngOnInit(): void {

  }

}
