// Web Audio API Sound Synthesizer for Plinko Game

class PlinkoSoundEngine {
  private ctx: AudioContext | null = null;
  private lastPegSoundTime = 0;
  private _isMuted = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public setMuted(muted: boolean): void {
    this._isMuted = muted;
  }

  public toggleMute(): boolean {
    this._isMuted = !this._isMuted;
    return this._isMuted;
  }

  // Sound 1: Ball Release Sound (when user clicks Place Bet or drops ball)
  public playRelease(): void {
    if (this._isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Crisp mechanical drop pop: fast slide from 540Hz down to 240Hz
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.07);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Audio playback failsafe
    }
  }

  // Sound 2: Peg Collision Sound ("middle balls" hit)
  public playPegHit(progressY: number = 0.5): void {
    if (this._isMuted) return;

    const nowMs = performance.now();
    // Throttle slightly (18ms) to prevent audio distortion during rapid multi-ball drops
    if (nowMs - this.lastPegSoundTime < 18) return;
    this.lastPegSoundTime = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Crystalline plink pitch: 750Hz to 1250Hz based on height + subtle variation
      const clampedY = Math.max(0, Math.min(1, progressY));
      const baseFreq = 780 + clampedY * 420 + (Math.random() - 0.5) * 50;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, now + 0.045);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio playback failsafe
    }
  }

  // Sound 3: Multiplier Slot Landing Sound (celebratory chime)
  public playSlotWin(multiplier: number): void {
    if (this._isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies =
        multiplier >= 10
          ? [523.25, 659.25, 783.99, 1046.5] // C major chord arpeggio for big wins
          : multiplier >= 3
          ? [587.33, 739.99, 880] // D major
          : [659.25, 880]; // Warm bell chime for regular wins

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.055;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.11, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // Audio playback failsafe
    }
  }
}

export const soundEngine = new PlinkoSoundEngine();

