export type LocationId =
  | 'beach'
  | 'jungle'
  | 'cave'
  | 'waterfall'
  | 'temple'
  | 'chamber';

export type GameStatus =
  | 'START_SCREEN'
  | 'PLAYING'
  | 'LOCATION_SOLVED'
  | 'GAME_OVER'
  | 'VICTORY';

export interface LocationInfo {
  id: LocationId;
  name: string;
  subtitle: string;
  order: number;
  coordinates: { x: number; y: number }; // Percentage on SVG map (0-100)
  itemReward: {
    id: string;
    name: string;
    icon: string;
    description: string;
    digitClue: string;
    digitValue?: number;
  };
}

export interface ClueExplanation {
  headline: string;
  concept: string;
  digitTakeaway: string;
}

export interface GameStats {
  score: number;
  hearts: number;
  maxHearts: number;
  timeElapsed: number; // in seconds
  hintsUsed: number;
  wrongAttempts: number;
  solvedLocations: LocationId[];
  collectedItems: string[];
}
