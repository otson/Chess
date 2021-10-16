import { Injectable } from '@angular/core';
import {Piece} from "./piece";

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  messages: string[] = ['Welcome to play chess! Move pieces by dragging them with a mouse.', "It's now White's turn."];
  isPlaying: boolean = true;
  isWhitesTurn = true;

  dragging: boolean  = false;
  startId: number = -1;
  advancedTwoMoves: number  = 0;
  board: number[] = new Array(64).fill(0);
  validMoves: number[] = new Array(64).fill(0);
  knightDirs: number[] =  [17,-17,15,-15, 10,-10,6,-6];

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

  constructor() {
    this.init();
  }

  init(){
    function isCharNumber(c: string) {
      return c >= '0' && c <= '9';
    }
    let rank = 7;
    let file = 0;
    for(let i = 0; i < this.fenStart.length; i++){
      let c = this.fenStart.charAt(i);
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

  doBlackTurn(){
    this.validMoves = new Array(64).fill(0);
    let moves = this.getValidMoves();
    console.log("Possible moves: "+moves.length);
    this.board = moves[Math.floor(moves.length * Math.random())];
    this.switchTurn();
  }

  /**
   * Return all possible board states resulting from next move.
   */
  getValidMoves(): number[][]{
    let states: number[][] = [];
    for(let i = 0; i < this.board.length; i++){
      if(this.board[i] < 0) { // black
        states.push(...this.getMoves(i));
      }
    }
    return states;
  }

  getBoardValue(){
    let val = 0;
    for(let i = 0; i < this.board.length; i++){
      val += this.board[i];
    }
    return val;
  }

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

  private setValidMoves(id: number){
    let val = Math.abs(this.board[id])
    switch(val) {
      case Math.abs(Piece.Pawn):
        this.setPawnMoves(id, this.board[id] > 0);
        break;
      case Math.abs(Piece.Knight):
        this.setKnightMoves(id, this.board[id] > 0);
        break;
      case Math.abs(Piece.Rook):
        this.setRookMoves(id, this.board[id] > 0);
        break;
      case Math.abs(Piece.Bishop):
        this.setBishopMoves(id, this.board[id] > 0);
        break;
      case Math.abs(Piece.Queen):
        this.setBishopMoves(id, this.board[id] > 0);
        this.setRookMoves(id, this.board[id] > 0);
        break;
      case Math.abs(Piece.King):
        this.setKingMoves(id, this.board[id] > 0);
        break;
    }
  }
  private setPawnMoves(id: number, white: boolean) {
    let rank = this.getRank(id);
    let file = this.getFile(id);

    let dir = white ? -1 : 1
    if(file > 0 && white == this.board[id +(dir*(8-dir))] <= dir) this.validMoves[id +(dir*(8-dir))] = 1;
    if(file < 7 && white == this.board[id +(dir*(8+dir))] <= dir) this.validMoves[id +(dir*(8+dir))] = 1;
    if(this.board[id +(dir*(8))] == 0) this.validMoves[id +(dir*(8))] = 1;
    if((rank == 1 && !white || rank == 6 && white) && this.validMoves[id +(dir*(8))]){
      if(white == (this.board[id +(dir*(16))] <= -dir)) this.validMoves[id +(dir*(16))] = 1;
    }
  }

  private setKnightMoves(id: number, white: boolean) {
    let rank = this.getRank(id);
    let file = this.getFile(id);
    for(let dir of this.knightDirs){
      let pos = id + dir;
      let newRank = this.getRank(pos);
      let newFile = this.getFile(pos);
      if((Math.abs(rank-newRank) == 1 && Math.abs(file-newFile) == 2 ||
        Math.abs(rank-newRank) == 2 && Math.abs(file-newFile) == 1
      ) && this.isValidMove(pos, white)){
        this.validMoves[id +dir] = 1;
      }
    }
  }

  private setKingMoves(id: number, white: boolean) {
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        if(i == 0 && j == 0) continue;
        let pos = id + 8 * i + j;
        if(this.isValidMove(pos, white)) this.validMoves[pos] = 1;
      }
    }
  }

  private setBishopMoves(id: number, white: boolean) {
    let i = id;
    while(this.getFile(i) < 7 && this.getRank(i) < 7){
      i += 9;
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) < 7 && this.getRank(i) > 0){
      i -= 7;
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) > 0  && this.getRank(i) < 7){
      i +=7;
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;

      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) > 0  && this.getRank(i) > 0){
      i -= 9;
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }
  }

  private setRookMoves(id: number, white: boolean) {
    let rank = this.getRank(id);
    let file = this.getFile(id);

    let i = id + 8;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i += 8;
      if(val == 1) break;
    }

    i = id -8;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i -= 8;
      if(val == 1) break;
    }

    i = id +1;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i +=1;
      if(val == 1) break;
    }

    i = id -1;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i -= 1;
      if(val == 1) break;
    }
  }

  private isValidMove(pos: number, white: boolean){
    if(pos < 0 || pos >= 64) return 0;
    if(white == this.board[pos] <= (white ? -1 : 1)) return 1;
    if(this.board[pos] == 0) return 2;
    return 0;
  }

  /**
   * y
   * @param id
   */
  private getRank(id: number){
    return Math.floor(id / 8);
  }

  /**
   * x
   * @param id
   */
  private getFile(id: number){
    return id % 8;
  }

  onMouseDown(id: number) {
    if(!this.isPlaying) return;
    if(this.board[id] > 0 == this.isWhitesTurn){
      this.dragging = true;
      this.startId = id;
      this.setValidMoves(id);
    }
  }

  onMouseUp(id: number) {
    if(this.validMoves[id] == 1){
      let oldPiece = this.board[id];
      this.board[id] = this.board[this.startId];
      this.board[this.startId] = 0;
      let rank = this.getRank(id);
      if(Math.abs(this.board[id]) == Piece.Pawn && (rank == 0 || rank == 7)){
        this.board[id] = this.board[id] > 0 ? Piece.Queen * Piece.White : Piece.Queen * Piece.Black;
      }
      if(Math.abs(oldPiece) == Piece.King){
        this.setGameEnded(oldPiece);
      }
      this.switchTurn();
      if(!this.isWhitesTurn){
        this.doBlackTurn();
      }
    }
    this.startId = -1;
    this.dragging = false;
    this.validMoves = new Array(64).fill(0);
  }

  private getMoves(i: number) {
    this.setValidMoves(i);
    let moves: number[][] = [];
    for(let j = 0; j < this.validMoves.length; j++){
      if(this.validMoves[j] == 1){
        moves.push(this.move(i, j, this.board.slice()));
        console.log('Move from '+i+" to "+j);
      }
      this.validMoves[j] = 0;
    }
    return moves;
  }

  move(from: number, to: number, board: number[]): number[]{
    let temp = board[to];
    board[to] = board[from];
    board[from] = 0;
    return board;
  }
}
