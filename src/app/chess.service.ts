import {Injectable} from '@angular/core';
import {Piece} from "./piece";

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public messages: string[] = [];
  public board: number[] = new Array(64).fill(0);
  public validMoves: number[] = new Array(64).fill(0);

  private isPlaying: boolean = true;
  private isWhitesTurn = true;
  private dragging: boolean = false;
  private startId: number = -1;
  private knightDirs: number[] = [17, -17, 15, -15, 10, -10, 6, -6];
  private fenStart = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  // https://docs.google.com/spreadsheets/d/1fWA-9QW-C8Dc-8LDrEemSligWcprkpKif6cNDs4V_mg/edit#gid=0
  private sampleEndGames = [
    '6k1/5p2/6p1/8/7p/8/6PP/6K1 b - - 0 0',
    '3k4/2n2B2/1KP5/2B2p2/5b1p/7P/8/8 b - - 0 0',
    'r7/4R2P/3p4/3k1K2/2p5/8/8/8 b - - 0 0',
    '8/8/5p2/1P1K1k2/8/2r5/8/7R w - - 0 0',
    '5n2/R7/4pk2/8/5PK1/8/8/8 b - - 0 0',
    '3Q4/8/1k6/7p/p1p4P/2q3PB/7K/8 b - - 0 0',
    '4q3/2R4P/5R2/1p6/p3k3/P7/KP6/8 b - - 0 0',
    'R7/8/5rk1/5p2/1p5P/5KP1/P7/8 b - - 0 0',
    '3k4/5ppp/2q5/3p2r1/8/1Q3P2/P4P1P/3R3K w - - 0 1',
    '4R3/1k6/1p2P1p1/p7/4r3/1P1r4/1K6/2R5 w - - 0 0',
    '5k2/R7/3K4/4p3/5P2/8/8/5r2 w - - 0 0',
    '5k2/1R6/4p1p1/1pr3Pp/7P/1K6/8/8 w - - 0 0',
    '5k2/8/p7/4K1P1/P4R2/6r1/8/8 b - - 0 0',
    '8/8/8/p2r1k2/7p/PP1RK3/6P1/8 b - - 0 0',
    '8/8/8/1P4p1/5k2/5p2/P6K/8 b - - 0 0',
    '3b2k1/1p3p2/p1p5/2P4p/1P2P1p1/5p2/5P2/4RK2 w - - 0 0',
    '5k2/3R4/2K1p1p1/4P1P1/5P2/8/3r4/8 b - - 0 0',
    '6k1/6pp/5p2/8/5P2/P7/2K4P/8 b - - 0 0',
    '8/3R4/8/r3N2p/P1Pp1P2/2k2K1P/3r4/8 w - - 0 0',
    '6k1/8/6r1/8/5b2/2PR4/4K3/8 w - - 0 0',
    '8/1p3k2/3B4/8/3b2P1/1P6/6K1/8 b - - 0 0',
    '8/8/8/2p1k3/P6R/1K6/6rP/8 w - - 0 0',
    '6k1/5p1p/6p1/1P1n4/1K4P1/N6P/8/8 w - - 0 0',
    '8/k5r1/2N5/PK6/2B5/8/8/8 b - - 0 0',
    '6k1/8/5K2/8/5P1R/r6P/8/8 b - - 0 0',
    '8/8/4k1KP/p5P1/r7/8/8/8 w - - 0 0',
    '1R6/p2r4/2ppkp2/6p1/2PKP2p/P4P2/6PP/8 b - - 0 0',
    '8/7p/6p1/8/k7/8/2K3P1/8 b - - 0 0',
    'R7/8/8/6p1/4k3/3rPp1P/8/6K1 b - - 0 0',
    '8/7p/1p1k2p1/p1p2p2/8/PP2P2P/4KPP1/8 w - - 0 0',
    '8/p7/1P6/1r3p1k/7P/3R1KP1/8/8 b - - 0 0',
    '8/5p1p/pk1p2p1/2pP4/2P2P2/4K2P/1P4P1/8 w - - 0 0',
    '5k2/5p2/6p1/7p/P7/2K3P1/7P/8 b - - 0 0',
    '8/8/5K2/3kn3/6B1/7P/8/8 b - - 0 0',
    '8/8/7k/8/8/8/5q2/3B2RK b - - 0 1',
    '8/p6p/1p2p1k1/4pp2/2P5/8/PP1K1PPP/8 b - - 0 0',
    '8/8/4kp2/5p1p/8/3KP1P1/7P/8 b - - 0 0',
    '8/7p/5kp1/4p3/p3rPRP/2K3P1/8/8 w - - 0 0',
    '8/6k1/8/R7/7K/1P6/5r2/8 b - - 0 1',
    '3b1N2/8/3k4/5pp1/8/5K1P/8/8 w - - 0 0',
    'R7/P7/5p2/4pk1p/5p2/3K1PP1/r6P/8 b - - 0 0',
    '8/7p/6p1/5k2/7N/8/4KP2/8 b - - 0 0',
    '6k1/8/p7/1p6/3K4/8/PPr4P/4R3 w - - 0 1',
    '8/8/6R1/5p1p/5k2/7r/8/2K5 w - - 0 0',
    '8/6Rp/8/5k2/5p2/5K2/7r/8 b - - 0 0',
    '6k1/3R4/5Kp1/6r1/4P3/8/8/8 b - - 0 0',
    '6K1/8/5P1k/2R5/1r6/8/2p5/8 w - - 0 0',
    'r1b2k2/1pp4p/3p2p1/pP1P4/2PN4/8/P5PP/4R1K1 w - - 0 24',
    '8/4k1pp/2p2r2/1p6/1P6/2R1K2P/P5P1/8 w - - 0 32',
    '2r5/3r4/p3k1b1/1p1pp1pp/8/1PP1NPP1/PK1R2P1/4R3 b - - 0 26',
    '5k2/1R3p2/1p2r2p/8/5pPP/5K2/8/8 b - - 0 38',
    '8/1k6/8/5NP1/8/2p3K1/8/r7 w - - 0 51',
    '8/1r4k1/3R1ppp/1p6/2p4P/2P5/1P4PK/8 b - - 0 43',
    '1r6/8/p4kp1/P1KP3p/8/7P/4B1P1/8 b - - 0 43',
    '8/8/2R2pk1/3r3p/1P3P1K/8/7P/8 w - - 0 47',
    '3B4/K7/2k1b1p1/1p2Pp1p/3P3P/2P3P1/8/8 w - - 0 74',
    '8/8/p5rp/3k4/1P2R3/2P1K3/6P1/8 w - - 0 1',
    '8/5pkp/1n4p1/1P6/3K2P1/2N4P/8/8 w - - 0 70',
    '8/8/7B/8/8/3p4/6Kp/3k1n2 w - - 0 0',
    '8/5pk1/4pbp1/7p/2Bp1P2/1P3KP1/8/8 b - - 0 45',
    '2r1r3/5k2/3p3p/pp6/4P1PP/3P3Q/1P6/7K w - - 0 34',
    '8/pp2k3/2p3B1/3p2P1/3n2K1/8/PPP5/8 b - - 0 0',
    '3b4/6k1/4p1p1/1p5p/1q2B2P/5QP1/5P2/6K1 w - - 0 0',
    '8/p4pk1/4n1p1/1p2P2p/q4P1P/P4QP1/5BK1/8 w - - 0 1',
    '4R3/3q1ppk/p6p/P7/2pr4/7P/4QPP1/6K1 w - - 0 36',
    '3r3k/p3b1pp/2p5/2p1p3/2P5/BPNPP1P1/P6P/6K1 w - - 0 33',
    '8/6pk/5p1p/8/2b5/P1B2PP1/4r2P/3R2K1 w - - 0 31',
    '3k4/2p2p2/1p5p/p1p1P1p1/P1Pn2P1/1P3P1P/1B3K2/8 w - - 0 30',
    '8/1p3p1k/4b1p1/1PP4p/4Q2P/2q5/5PP1/5BK1 w - - 0 42',
    '6b1/6p1/8/5kPP/K7/P1P5/8/8 w - - 0 50',
    '8/3N4/1p2p2p/p1k1P3/4Rn2/P4r2/1KP4P/8 b - - 0 42',
    '4b3/8/1p4p1/p1k1np1p/P1PNp2P/2K1P1P1/4BP2/8 w - - 0 68',
    '4k3/2b5/6pN/2p4p/2B2p2/3P4/1P5P/3b2K1 w - - 0 41',
    '3b4/6k1/4pqp1/1B5p/7P/5QP1/5P2/6K1 w - - 0 41',
    '8/7B/8/2pkP2R/p6p/PbK5/6PP/3r4 b - - 0 45',
    '4r1k1/1q3pp1/3p3p/1p2p3/2pPP1Q1/2P1P2P/1P4PK/R7 w - - 0 29',
    '8/1kp5/1pp3p1/p1n1qp2/4P3/3P1QP1/PPP1N3/1K6 w - - 0 27',
    '6k1/1p3pp1/p2np2p/P7/2P2P2/1P5P/4N1P1/6K1 w - - 0 36',
    '1n6/4k2p/p3ppp1/1pPp4/3P1PP1/3NP3/P3K2P/8 w - - 0 27',
    '3q2k1/1p3p2/2p1b3/4p1p1/p1P1P1P1/1P3P1p/P3Q2P/3N3K b - - 0 37',
    '8/8/8/pp1k1p2/7p/1PK1PP1P/8/8 w - - 0 52',
    '6k1/R7/8/5pp1/6P1/N3r3/P5KP/2b5 b - - 0 44',
    '7r/8/8/6k1/R6p/6pK/8/8 w - - 0 52',
    '8/8/6pk/4Rp2/4p2P/6PK/1r6/8 b - - 3 57',
    '8/6k1/1p1r2pp/p7/P1P1K1P1/1P3R1P/8/8 b - - 0 42',
    '2r5/3k1pp1/p7/1p2P1P1/3PK3/8/P7/1R6 w - - 0 35',
    '8/6pp/1k1r1p2/8/1R2P3/4KP2/6rP/1R6 b - - 0 29',
    'R7/8/8/8/6K1/5p2/5Pk1/4r3 w - - 0 1',
    '8/5ppk/3N4/6n1/3RP3/1r6/5PPK/8 b - - 0 1',
    '6k1/2p3np/1p1p2p1/3P4/1PPK1R2/6PB/7P/4r3 w - - 0 1',
    '8/r7/5PK1/3k4/p7/8/1R6/8 w - - 0 0',
    '5k2/5p2/6p1/2P1Pn1p/3pBP2/1N1P3b/5K2/8 w - - 0 0',
    '3k4/1K5p/p2rpp2/4b1p1/P7/2P2B1P/1P3PP1/4R3 b - - 0 41',
    '8/8/1pB2k1p/2p1pPpP/2P1P1P1/bP6/P1K5/8 w - - 0 1',
    '8/pR4pk/1b2p3/2p3p1/N1p5/7P/PP1r2P1/6K1 b - - 0 1',
    '3R4/7k/8/2p5/1pPb4/1P5P/3n2KP/8 w - - 0 50',
    'R7/P4r2/5k2/3Kp3/8/8/8/8 w - - 0 0',
    '8/pp4pp/4k3/3rPp2/1Pr4P/2B1KPP1/1P6/4R3 b - - 0 30',
    '8/p3k1p1/5p1p/5P2/3PP3/8/P5K1/8 w - - 0 0',
    '8/8/1p1k4/5ppp/PPK1p3/6P1/5PP1/8 b - - 0 40',
    '8/5pp1/7p/5P1P/2p3P1/2k5/5P2/2K5 w - - 0 0',
    '8/8/5n2/1P1k4/3p1P2/3P1K2/8/8 w - - 0 0',
    '8/4kppp/R7/1r6/4PK1P/6P1/5P2/8 b - - 0 3',
    '8/6p1/5p2/4pk2/r6p/5P2/4RKPP/8 b - - 0 1',
    '8/5p2/r4kpp/P7/R6P/6P1/5PK1/8 w - - 0 1',
    'R7/5pk1/P5p1/7p/7P/r5P1/5P2/5K2 b - - 0 1',
    '8/r7/5ppk/p6p/8/R5P1/5P1P/6K1 w - - 0 1',
    '6k1/6pp/8/2r2p2/P4P1P/3R2P1/8/5K2 b - - 0 1',
    '8/5k2/4p3/2R2p2/6p1/4P1P1/1P2KP2/7r w - - 0 1',
    'R7/6k1/P5p1/5p1p/5P1P/r5P1/5K2/8 b - - 0 1',
    'R7/6k1/P7/5p1p/5PpP/6P1/r7/6K1 w - - 0 1',
    '8/5p2/4pk2/p6p/3P3P/2K1PP2/8/8 b - - 0 43',
    '8/PR4p1/5k2/7p/4p3/7P/r4PP1/5K2 w - - 0 42',
    '3r4/5p1p/pkn3p1/1p6/8/1P2R3/1PB2PPP/4K3 b - - 0 28',
    'b1k4r/p4ppp/4n3/1R6/8/8/PPP2P1P/2KR4 w - - 0 20',
    '3r4/4k1p1/3pp2p/2p2p2/r1P5/3KPP2/P2R2PP/3R4 w - - 0 30',
    '4k3/p1p2r1p/1p4p1/n2p4/P2P1P1P/2PB2P1/6K1/R7 w - - 0 27',
    '5rk1/p3r2p/1pp3p1/5p2/R1PPp2P/4P1P1/P4P2/1R3K2 w - - 0 27',
    '8/5pp1/p3p3/1p1kP2p/1b3P1P/1P1K2P1/P4B2/8 b - - 0 33',
    '4n3/1p1b1p2/p2k2p1/P2p3p/1P1N3P/2PB1PP1/5K2/8 w - - 0 32',
    '8/p2R1pkp/1p4p1/4P1r1/1P6/8/P3KPP1/8 w - - 0 37',
    '3b4/8/1p6/p2k4/PP4Kp/8/8/4B3 b - - 0 1',
    '8/8/8/1p2b1pp/p3Pp2/Pk3P1P/1P6/2KN4 b - - 0 1',
    '8/2R5/p3k1p1/nr4P1/3PKP2/2B5/8/8 w - - 0 1',
    '8/8/8/p1k2K1R/5P1P/8/4p1n1/8 w - - 0 1',
    '8/2k5/8/8/R4b2/4p1p1/5r2/4B1K1 b - - 0 1',
    '8/B2k4/1P3K2/3bP3/8/8/8/8 w - - 0 1',
    '8/5k1p/5PpB/3PR3/2r4P/1p3K2/2b5/8 b - - 0 1',
    '8/1p2p1kp/4p3/7p/8/5K2/1PP3P1/8 w - - 0 1',
    '6k1/1pp3pp/p4p2/8/8/Pb2B3/1P3PPP/6K1 w - - 0 1',
    '8/5k2/6R1/4r2p/8/6KP/6P1/8 w - - 5 49',
    '8/pp4pp/2pn1k2/3p1p2/3P1K2/6PP/PPP1B1P1/8 w - - 0 24',
    '4n3/p3k3/1p4P1/2pK4/P2p4/1P6/2P1B3/8 w - - 0 49',
    'r7/pp5k/7p/3P1Np1/8/PP5P/1B5K/8 w - - 0 36',
    '8/8/1Q5p/5p1k/P7/5PP1/b6K/q7 w - - 0 45',
    '8/p5k1/6p1/n1p5/4B3/8/P5PP/5K2 w - - 0 1',
    '8/1p4p1/5p1p/1k3P2/6PP/3KP3/8/8 w - - 0 50',
    '8/8/1p1k4/5ppp/PPK1p3/6P1/5PP1/8 b - - 0 0',
    '8/5k2/4p2p/4P3/B1np1KP1/3b4/8/2B5 b - - 0 1',
  ]
  private pieceFromSymbol = new Map([
    ['k', Piece.King],
    ['p', Piece.Pawn],
    ['n', Piece.Knight],
    ['b', Piece.Bishop],
    ['r', Piece.Rook],
    ['q', Piece.Queen],
  ])

  constructor() {
    this.addWelcomeMessage();
    this.initBoard(this.fenStart);
  }

  initBoard(fen: string) {
    function isCharNumber(c: string) {
      return c >= '0' && c <= '9';
    }

    let rank = 7;
    let file = 0;
    for (let i = 0; i < fen.length; i++) {
      let c = fen.charAt(i);
      if (c == ' ') break;
      if (c == '/') {
        file = 0;
        rank--;
      } else {
        if (isCharNumber(c)) {
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

  public reset() {
    this.messages = [];
    this.board.fill(0);
    this.initBoard(this.fenStart);
    this.isPlaying = true;
    this.isWhitesTurn = true;
    this.addTurnChangeMessage();
  }

  public startRandomEndGame() {
    this.messages = [];
    this.board.fill(0);
    this.initBoard(this.sampleEndGames[Math.floor(this.sampleEndGames.length * Math.random())]);
    this.isPlaying = true;
    this.isWhitesTurn = true;
    this.addMessage("Starting a new game from a randomly selected sample endgame.");
    this.addTurnChangeMessage();
  }

  simulateTurn() {
    let bestMove = this.getBestMove(this.board, this.isWhitesTurn);
    if (bestMove == undefined || bestMove.length == 0) {
      this.setGameEnded(!this.isWhitesTurn);
      return;
    }
    this.board = bestMove;
    this.switchTurn();
  }

  /**
   * Return all possible board resulting from current turn's move.
   */
  getPossibleBoardStates(board: number[] = this.board, isWhitesTurn: boolean = this.isWhitesTurn): number[][] {
    let states: number[][] = [];
    this.validMoves = new Array(64).fill(0);
    for (let i = 0; i < board.length; i++) {
      if (isWhitesTurn && board[i] > 0 || !isWhitesTurn && board[i] < 0) {
        states.push(...this.getPossibleBoardStatesFromPosition(i, board));
      }
    }
    return states;
  }

  isLegalMove(move: number[], isWhitesTurn: boolean) {
    /**
     * Moves the opponent can make. If any of them result in your king getting captured, the move is illegal.
     */
    let opponentMoves = this.getPossibleBoardStates(move, !isWhitesTurn);
    for (let opponentMove of opponentMoves) {
      if (this.checkKingIsDead(opponentMove)) {
        return false;
      }
    }
    return true;
  }

  isCheck(board: number[], isWhitesTurn: boolean) {
    let opponentMoves = this.getPossibleBoardStates(board, isWhitesTurn);
    for (let opponentMove of opponentMoves) {
      if (this.checkKingIsDead(opponentMove)) {
        return true;
      }
    }
    return false;
  }

  getBoardValue(board: number[]) {
    let val = 0;
    for (let i = 0; i < board.length; i++) {
      val += board[i];
      if (board[i] != 0 && Math.abs(board[i]) != Piece.King) {
        // Moving pieces forward increases board value
        val += this.getRank(63 - i) * 0.0001 * Math.abs(board[i]);
      }
    }
    return val;
  }

  setGameEnded(isWhiteWinner: boolean) {
    this.addMessage('Checkmate!' + (isWhiteWinner ? ' White' : ' Black') + ' wins!');
    this.isPlaying = false;
  }

  switchTurn() {
    if (!this.isPlaying) return;
    if (this.isCheck(this.board, this.isWhitesTurn)) {
      this.addMessage("Check! " + this.getCurrentColorString(!this.isWhitesTurn) + "'s King is in danger!");
    }
    this.isWhitesTurn = !this.isWhitesTurn;
    this.addTurnChangeMessage();
  }

  getCurrentColorString(isWhitesTurn: boolean = this.isWhitesTurn) {
    return isWhitesTurn ? 'White' : 'Black';
  }

  onMouseDown(id: number) {
    if (!this.isPlaying) return;
    if (this.board[id] > 0 == this.isWhitesTurn) {
      this.dragging = true;
      this.startId = id;
      this.setValidMoves(id, this.board);
    }
  }

  onMouseUp(id: number) {
    if (this.validMoves[id] == 1) {
      let oldPiece = this.board[id];
      let newBoard = this.move(this.startId, id, this.board.slice());
      if (!this.isLegalMove(newBoard, this.isWhitesTurn)) {
        this.addMessage("That move would result in a checkmate, so it is not allowed. Time to surrender?");
        this.validMoves = new Array(64).fill(0);
        return;
      }
      this.board = newBoard;
      if (Math.abs(oldPiece) == Piece.King) {
        this.setGameEnded(oldPiece > 0);
      }
      this.switchTurn();
      if (!this.isWhitesTurn) {
        this.simulateTurn();
      }
    }
    this.startId = -1;
    this.dragging = false;
    this.validMoves = new Array(64).fill(0);
  }

  move(from: number, to: number, board: number[]): number[] {
    board[to] = board[from];
    board[from] = 0;
    let rank = this.getRank(to);
    if (Math.abs(board[to]) == Piece.Pawn && (rank == 0 || rank == 7)) {
      board[to] = board[to] > 0 ? Piece.Queen * Piece.White : Piece.Queen * Piece.Black;
    }
    return board;
  }

  getLegalBoardStates(board: number[] = this.board, isWhitesTurn: boolean = this.isWhitesTurn): number[][] {
    return this.getPossibleBoardStates(board, isWhitesTurn).filter(move => this.isLegalMove(move, isWhitesTurn));
  }

  private addTurnChangeMessage() {
    this.addMessage("It's now " + this.getCurrentColorString() + "'s turn.");
  }

  private checkKingIsDead(board: number[]) {
    let whiteKingAlive = false;
    let blackKingAlive = false;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == Piece.King * Piece.White) whiteKingAlive = true;
      if (board[i] == Piece.King * Piece.Black) blackKingAlive = true;
    }
    return !whiteKingAlive || !blackKingAlive;
  }

  private addWelcomeMessage() {
    this.addMessage('Welcome to play chess! Move pieces by dragging them with a mouse.');
  }

  private addMessage(message: string) {
    this.messages.push(message);
    this.messages = this.messages.slice(-3);
  }

  private setValidMoves(id: number, board: number[]) {
    let val = Math.abs(this.board[id])
    switch (val) {
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
    if ((rank == 1 && !white && board[id + 8] == 0 && board[id + 16] == 0) ||
      (rank == 6 && white && board[id - 8] == 0 && board[id - 16] == 0)) this.validMoves[id + (dir * (16))] = 1;
  }

  private setKnightMoves(id: number, white: boolean, board: number[]) {
    let rank = this.getRank(id);
    let file = this.getFile(id);
    for (let dir of this.knightDirs) {
      let pos = id + dir;
      let newRank = this.getRank(pos);
      let newFile = this.getFile(pos);
      if ((Math.abs(rank - newRank) == 1 && Math.abs(file - newFile) == 2 ||
        Math.abs(rank - newRank) == 2 && Math.abs(file - newFile) == 1
      ) && this.isValidMove(pos, white, board)) {
        this.validMoves[id + dir] = 1;
      }
    }
  }

  private setKingMoves(id: number, white: boolean, board: number[]) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;
        let pos = id + 8 * i + j;
        if(Math.abs(this.getFile(id)-this.getFile(pos)) > 1) continue;
        if (this.isValidMove(pos, white, board)) this.validMoves[pos] = 1;
      }
    }
  }

  private setBishopMoves(id: number, white: boolean, board: number[]) {
    let i = id;
    while (this.getFile(i) < 7 && this.getRank(i) < 7) {
      i += 9;
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      if (val == 1) break;
    }

    i = id;
    while (this.getFile(i) < 7 && this.getRank(i) > 0) {
      i -= 7;
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      if (val == 1) break;
    }

    i = id;
    while (this.getFile(i) > 0 && this.getRank(i) < 7) {
      i += 7;
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;

      if (val == 1) break;
    }

    i = id;
    while (this.getFile(i) > 0 && this.getRank(i) > 0) {
      i -= 9;
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      if (val == 1) break;
    }
  }

  private setRookMoves(id: number, white: boolean, board: number[]) {
    let rank = this.getRank(id);
    let file = this.getFile(id);

    let i = id + 8;
    while (rank == this.getRank(i) || file == this.getFile(i)) {
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      i += 8;
      if (val == 1) break;
    }

    i = id - 8;
    while (rank == this.getRank(i) || file == this.getFile(i)) {
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      i -= 8;
      if (val == 1) break;
    }

    i = id + 1;
    while (rank == this.getRank(i) || file == this.getFile(i)) {
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      i += 1;
      if (val == 1) break;
    }

    i = id - 1;
    while (rank == this.getRank(i) || file == this.getFile(i)) {
      let val = this.isValidMove(i, white, board);
      if (val == 0) break;
      this.validMoves[i] = 1;
      i -= 1;
      if (val == 1) break;
    }
  }

  private isValidMove(pos: number, white: boolean, board: number[]) {
    if (pos < 0 || pos >= 64) return 0;
    if (white == board[pos] <= (white ? -1 : 1)) return 1;
    if (board[pos] == 0) return 2;
    return 0;
  }

  /**
   * y
   * @param id
   */
  private getRank(id: number) {
    return Math.floor(id / 8);
  }

  /**
   * x
   * @param id
   */
  private getFile(id: number) {
    return id % 8;
  }

  /**
   * Return possible board states resulting from all possible moves from given position.
   */
  private getPossibleBoardStatesFromPosition(pos: number, board: number[] = this.board) {
    this.setValidMoves(pos, board);
    let moves: number[][] = [];
    for (let j = 0; j < this.validMoves.length; j++) {
      if (this.validMoves[j] == 1) {
        moves.push(this.move(pos, j, board.slice()));
      }
      this.validMoves[j] = 0;
    }
    return moves;
  }

  /**
   * 1. Get all valid moves, and their score.
   * 2. For all valid moves, get all valid opponents moves. Update the score.
   * 3. Repeat until n = 0
   * 4. The move with best score is the best move.
   */
  private getBestMove(board: number[], isWhitesTurn: boolean): number[] {
    this.validMoves = new Array(64).fill(0);
    let possibleMoves = this.getLegalBoardStates(board, isWhitesTurn);
    if (possibleMoves.length == 0) {
      return [];
    }
    let bestMove: number[] = [];
    let bestScore: number = isWhitesTurn ? Number.MIN_VALUE : Number.MAX_VALUE;
    for (let move of possibleMoves) {
      let oppMove = this.getLegalBoardStates(move, !isWhitesTurn).reduce(
        (a, b) => this.getBoardValue(a) > this.getBoardValue(b) ? a : b
      );
      let totalScore = this.getBoardValue(move) + this.getBoardValue(oppMove);
      if (isWhitesTurn && bestScore < totalScore || !isWhitesTurn && bestScore > totalScore) {
        bestScore = totalScore;
        bestMove = move;
      }
    }
    return bestMove;
  }
}
