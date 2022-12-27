import { Moves, VirtualBoardSituation } from 'src/types/types'

interface ChessInterface {
  name: string
}

export default abstract class Chess implements ChessInterface {
  public name = ''
  abstract generateMoves (seq: number, situation: VirtualBoardSituation): Moves
}