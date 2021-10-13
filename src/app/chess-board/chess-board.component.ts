import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  @Input() board = Array.from(Array(64).keys())

  ngOnInit(): void {

  }

}
