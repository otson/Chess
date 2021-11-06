import { Component, OnInit } from '@angular/core';
import {ChessService} from "../chess.service";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  constructor(public chessService: ChessService) { }

  ngOnInit(): void {
  }

}
