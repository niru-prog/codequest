const BEST_SCORE_KEY = 'codequest_best_score_v1';
const AUDIO_MUTED_KEY = 'codequest_audio_muted_v1';

export function getStoredBestScore(): number {
  try {
    const val = localStorage.getItem(BEST_SCORE_KEY);
    if (val !== null) {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
  } catch {
    // Storage may be blocked in some iframe contexts
  }
  return 0;
}

export function saveBestScore(newScore: number): number {
  try {
    const current = getStoredBestScore();
    if (newScore > current) {
      localStorage.setItem(BEST_SCORE_KEY, newScore.toString());
      return newScore;
    }
    return current;
  } catch {
    return newScore;
  }
}

export function getStoredAudioMuted(): boolean {
  try {
    const val = localStorage.getItem(AUDIO_MUTED_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function saveAudioMuted(muted: boolean): void {
  try {
    localStorage.setItem(AUDIO_MUTED_KEY, muted ? 'true' : 'false');
  } catch {}
}
