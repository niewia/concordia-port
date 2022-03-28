export enum GameState {
  PUBLISHED,
  IN_PROGRESS,
  FINISHED,
}

export interface GameData {
  id?: string;
  name: string;
  connectedPlayers?: Player[];
  host: Player;
  state: GameState;
}

export interface Player {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  color?: number;
}

export enum PawnType {
  LAND,
  SEA,
}

export interface PawnData {
  x: number;
  y: number;
  type: PawnType;
}
