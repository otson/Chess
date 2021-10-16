import { Injectable } from '@angular/core';
import {Piece} from "./piece";

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  messages: string[] = ['Welcome to play chess! Move pieces by dragging them with a mouse.', "It's now White's turn."];
  isPlaying: boolean = true;
  isWhitesTurn = true;
  isCheckState = false;

  dragging: boolean  = false;
  startId: number = -1;
  board: number[] = new Array(64).fill(0);
  validMoves: number[] = new Array(64).fill(0);
  knightDirs: number[] =  [17,-17,15,-15, 10,-10,6,-6];
  posValues: number[] = [];

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
    for(let i = 1; i <= 8; i++){
      for(let j = -4; j < 4; j++){
        this.posValues.push(0.001*i-Math.abs(j*0.0001));
      }
    }
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

  simulateTurn(){
    this.validMoves = new Array(64).fill(0);
    let possibleMoves = this.getPossibleBoardStates(this.board, this.isWhitesTurn);
    console.log("Possible moves: "+possibleMoves.length);
    possibleMoves = possibleMoves.filter(move => this.isLegalMove(move, this.isWhitesTurn));
    console.log("Possible moves after filtering out moves that would result in a checkmate: "+possibleMoves.length);
    if(possibleMoves.length == 0){
      this.setGameEnded(!this.isWhitesTurn);
      return;
    }
    let bestMove = possibleMoves[0];
    let bestMoveValue = this.isWhitesTurn? Number.MIN_VALUE : Number.MAX_VALUE;
    for(let i = 1; i < possibleMoves.length; i++){
      let value = this.getBoardValue(possibleMoves[i]);
      if(this.isWhitesTurn && value > bestMoveValue || !this.isWhitesTurn && value < bestMoveValue){
        bestMoveValue = value;
        bestMove = possibleMoves[i];
      }
    }
    this.board = bestMove;
    this.switchTurn();
  }

  /**
   * Return all possible board states resulting from next move.
   */
  getPossibleBoardStates(board: number[] = this.board, isWhitesTurn: boolean = this.isWhitesTurn): number[][]{
    let states: number[][] = [];
    this.validMoves = new Array(64).fill(0);
    for(let i = 0; i < board.length; i++){
      if(isWhitesTurn && board[i] > 0 || !isWhitesTurn && board[i] < 0) {
        states.push(...this.getPossibleBoardStatesFromPosition(i, board));
      }
    }
    return states;
  }

  isLegalMove(move: number[], isWhitesTurn: boolean){
    /**
     * Moves the opponent can make. If any of them result in your king getting captured, the move is illegal.
     */
    let opponentMoves = this.getPossibleBoardStates(move, !isWhitesTurn);
    for(let opponentMove of opponentMoves){
      if(this.checkKingIsDead(opponentMove)){
        return false;
      }
    }
    return true;
  }

  getBoardValue(board: number[]){
    let val = 0;
    for(let i = 0; i < board.length; i++){
      val += board[i] - (board[i] > 0 && this.isWhitesTurn || board[i] < 0 && !this.isWhitesTurn ? this.posValues[i] : 0);
    }
    return val;
  }

  setGameEnded(isWhiteWinner: boolean) {
    this.addMessage('Checkmate!' + (isWhiteWinner ?  ' White' : ' Black') + ' wins!');
    this.isPlaying = false;
  }

  switchTurn(){
    if(!this.isPlaying) return;
    this.isWhitesTurn = !this.isWhitesTurn;
    this.addMessage("It's now "+ (this.isWhitesTurn ? 'White' : 'Black')+"'s turn.");
  }

  private checkKingIsDead(board: number[]){
    let whiteKingAlive = false;
    let blackKingAlive = false;
    for(let i = 0; i < board.length; i++){
      if(board[i] == Piece.King * Piece.White) whiteKingAlive = true;
      if(board[i] == Piece.King * Piece.Black) blackKingAlive = true;
    }
    return !whiteKingAlive || !blackKingAlive;
  }

  private addMessage(message: string){
    this.messages.push(message);
    this.messages = this.messages.slice(-3);
  }

  private setValidMoves(id: number, board: number[]){
    let val = Math.abs(this.board[id])
    switch(val) {
      case Math.abs(Piece.Pawn):
        this.setPawnMoves(id, board[id] > 0, board);
        break;
      case Math.abs(Piece.Knight):
        this.setKnightMoves(id, board[id] > 0, board);
        break;
      case Math.abs(Piece.Rook):
        this.setRookMoves(id, board[id] > 0, board);
        break;
      case Math.abs(Piece.Bishop):
        this.setBishopMoves(id, board[id] > 0, board);
        break;
      case Math.abs(Piece.Queen):
        this.setBishopMoves(id, board[id] > 0, board);
        this.setRookMoves(id, board[id] > 0, board);
        break;
      case Math.abs(Piece.King):
        this.setKingMoves(id, board[id] > 0, board);
        break;
    }
  }
  private setPawnMoves(id: number, white: boolean, board: number[]) {
    let rank = this.getRank(id);
    let file = this.getFile(id);

    let dir = white ? -1 : 1
    if (file > 0 && white == board[id + (dir * (8 - dir))] <= dir) this.validMoves[id + (dir * (8 - dir))] = 1;
    if (file < 7 && white == board[id + (dir * (8 + dir))] <= dir) this.validMoves[id + (dir * (8 + dir))] = 1;
    if (board[id + (dir * (8))] == 0) this.validMoves[id + (dir * (8))] = 1;
    if ((rank == 1  && !white && board[id + 8] == 0 && board[id + 16] == 0) ||
      (rank == 6 && white && board[id - 8] == 0 && board[id - 16] == 0)) this.validMoves[id + (dir * (16))] = 1;
  }

  private setKnightMoves(id: number, white: boolean, board: number[]) {
    let rank = this.getRank(id);
    let file = this.getFile(id);
    for(let dir of this.knightDirs){
      let pos = id + dir;
      let newRank = this.getRank(pos);
      let newFile = this.getFile(pos);
      if((Math.abs(rank-newRank) == 1 && Math.abs(file-newFile) == 2 ||
        Math.abs(rank-newRank) == 2 && Math.abs(file-newFile) == 1
      ) && this.isValidMove(pos, white, board)){
        this.validMoves[id +dir] = 1;
      }
    }
  }

  private setKingMoves(id: number, white: boolean, board: number[]) {
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        if(i == 0 && j == 0) continue;
        let pos = id + 8 * i + j;
        if(this.isValidMove(pos, white, board)) this.validMoves[pos] = 1;
      }
    }
  }

  private setBishopMoves(id: number, white: boolean, board: number[]) {
    let i = id;
    while(this.getFile(i) < 7 && this.getRank(i) < 7){
      i += 9;
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) < 7 && this.getRank(i) > 0){
      i -= 7;
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) > 0  && this.getRank(i) < 7){
      i +=7;
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;

      if(val == 1) break;
    }

    i = id;
    while(this.getFile(i) > 0  && this.getRank(i) > 0){
      i -= 9;
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      if(val == 1) break;
    }
  }

  private setRookMoves(id: number, white: boolean, board: number[]) {
    let rank = this.getRank(id);
    let file = this.getFile(id);

    let i = id + 8;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i += 8;
      if(val == 1) break;
    }

    i = id -8;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i -= 8;
      if(val == 1) break;
    }

    i = id +1;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i +=1;
      if(val == 1) break;
    }

    i = id -1;
    while(rank == this.getRank(i) || file == this.getFile(i)){
      let val = this.isValidMove(i, white, board);
      if(val == 0) break;
      this.validMoves[i] = 1;
      i -= 1;
      if(val == 1) break;
    }
  }

  private isValidMove(pos: number, white: boolean, board: number[]){
    if(pos < 0 || pos >= 64) return 0;
    if(white == board[pos] <= (white ? -1 : 1)) return 1;
    if(board[pos] == 0) return 2;
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
      this.setValidMoves(id, this.board);
    }
  }

  onMouseUp(id: number) {
    if(this.validMoves[id] == 1){
      let oldPiece = this.board[id];
      let newBoard = this.move(this.startId, id, this.board.slice());
      if(!this.isLegalMove(newBoard, this.isWhitesTurn)){
        this.addMessage("That move would result in a checkmate, so it is not allowed. Time to surrender?");
        this.validMoves = new Array(64).fill(0);
        return;
      }
      this.board = newBoard;
      if(Math.abs(oldPiece) == Piece.King){
        this.setGameEnded(oldPiece > 0);
      }
      this.switchTurn();
      if(!this.isWhitesTurn){
        this.simulateTurn();
      }
    }
    this.startId = -1;
    this.dragging = false;
    this.validMoves = new Array(64).fill(0);
  }

  /**
   * Return possible board states resulting from all possible moves from given position.
   */
  private getPossibleBoardStatesFromPosition(pos: number, board: number[] = this.board) {
    this.setValidMoves(pos, board);
    let moves: number[][] = [];
    for(let j = 0; j < this.validMoves.length; j++){
      if(this.validMoves[j] == 1){
        moves.push(this.move(pos, j, board.slice()));
      }
      this.validMoves[j] = 0;
    }
    return moves;
  }

  move(from: number, to: number, board: number[]): number[]{
    board[to] = board[from];
    board[from] = 0;
    let rank = this.getRank(to);
    if(Math.abs(board[to]) == Piece.Pawn && (rank == 0 || rank == 7)){
      board[to] = board[to] > 0 ? Piece.Queen * Piece.White : Piece.Queen * Piece.Black;
    }
    return board;
  }
}
