export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export class AudioManager {
  private static instance: AudioManager;
  
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  public masterVolume: number = 1.0;
  public musicVolume: number = 0.5;
  public sfxVolume: number = 0.8;
  public muted: boolean = false;
  
  private lastBumperTime: number = 0;
  private lastWallTime: number = 0;
  
  private currentMusicOscillators: OscillatorNode[] = [];
  
  private constructor() {}
  
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  public init() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.audioCtx = new AudioContextClass();
    this.masterGain = this.audioCtx.createGain();
    this.musicGain = this.audioCtx.createGain();
    this.sfxGain = this.audioCtx.createGain();
    
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);
    
    this.updateVolumes();
  }
  
  public updateVolumes() {
    if (!this.masterGain || !this.musicGain || !this.sfxGain || !this.audioCtx) return;
    
    const m = this.muted ? 0 : 1;
    this.masterGain.gain.setValueAtTime(this.masterVolume * m, this.audioCtx.currentTime);
    this.musicGain.gain.setValueAtTime(this.musicVolume, this.audioCtx.currentTime);
    this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.audioCtx.currentTime);
  }
  
  public setVolumes(master: number, music: number, sfx: number) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    this.updateVolumes();
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.updateVolumes();
  }
  
  public loadSettings(settings?: AudioSettings) {
    if (!settings) return;
    this.masterVolume = settings.masterVolume ?? 1.0;
    this.musicVolume = settings.musicVolume ?? 0.5;
    this.sfxVolume = settings.sfxVolume ?? 0.8;
    this.muted = settings.muted ?? false;
    this.updateVolumes();
  }
  
  public getSettings(): AudioSettings {
    return {
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      muted: this.muted
    };
  }

  public playSFX(type: string) {
    if (!this.audioCtx || this.muted || this.sfxVolume === 0 || this.masterVolume === 0) return;
    const now = performance.now();
    
    if (type === "menu_click") {
      this.playTone(550, "sine", 0.1, 0.4);
    } else if (type === "menu_back") {
      this.playTone(330, "triangle", 0.15, 0.4);
    } else if (type === "menu_hover") {
      this.playTone(720, "sine", 0.05, 0.1);
    } else if (type === "bumper") {
      if (now - this.lastBumperTime < 50) return;
      this.lastBumperTime = now;
      this.playTone(440, "sine", 0.1, 0.5);
    } else if (type === "wall") {
      if (now - this.lastWallTime < 50) return;
      this.lastWallTime = now;
      this.playTone(220, "triangle", 0.05, 0.4);
    } else if (type === "player_launch") {
      this.playSweep(150, 600, "square", 0.2, 0.3);
    } else if (type === "turret_kill") {
      this.playTone(880, "square", 0.1, 0.3);
      this.playTone(1100, "sine", 0.1, 0.3, 0.05);
    } else if (type === "boss_hit") {
      this.playSweep(200, 150, "sawtooth", 0.15, 0.5);
    } else if (type === "boss_death") {
      this.playSweep(400, 50, "sawtooth", 1.5, 1.0);
      this.playSweep(800, 100, "square", 1.5, 0.8);
    } else if (type === "chrono_activate") {
      this.playSweep(400, 800, "sine", 0.5, 0.6);
    } else if (type === "chrono_exhausted") {
      this.playSweep(800, 200, "sawtooth", 0.5, 0.5);
    } else if (type === "chrono_recovery") {
      this.playTone(1200, "sine", 0.2, 0.4);
    } else if (type === "mine_explosion") {
      this.playSweep(300, 50, "square", 0.4, 0.8);
    } else if (type === "player_damage") {
      this.playSweep(400, 100, "sawtooth", 0.3, 0.7);
    } else if (type === "wave_clear") {
      this.playTone(440, "sine", 0.2, 0.5);
      this.playTone(554, "sine", 0.2, 0.5, 0.2);
      this.playTone(659, "sine", 0.4, 0.5, 0.4);
    } else if (type === "perfect_wave") {
      this.playTone(659, "sine", 0.2, 0.5);
      this.playTone(880, "sine", 0.2, 0.5, 0.2);
      this.playTone(1318, "sine", 0.4, 0.5, 0.4);
    } else if (type === "game_over") {
      this.playSweep(300, 50, "sawtooth", 1.0, 0.8);
    } else if (type === "achievement") {
      this.playTone(880, "sine", 0.1, 0.5);
      this.playTone(1760, "sine", 0.3, 0.5, 0.1);
    } else if (type === "upgrade") {
      this.playTone(600, "square", 0.1, 0.4);
      this.playTone(800, "square", 0.2, 0.4, 0.1);
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number, delaySec = 0) {
    if (!this.audioCtx || !this.sfxGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    const startTime = this.audioCtx.currentTime + delaySec;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playSweep(freqStart: number, freqEnd: number, type: OscillatorType, duration: number, vol: number, delaySec = 0) {
    if (!this.audioCtx || !this.sfxGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    const startTime = this.audioCtx.currentTime + delaySec;
    osc.frequency.setValueAtTime(freqStart, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), startTime + duration);
    
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public playMusic(theme: "MENU" | "GAMEPLAY" | "BOSS") {
    this.stopMusic();
    if (!this.audioCtx || !this.musicGain || this.muted || this.musicVolume === 0 || this.masterVolume === 0) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    
    if (theme === "MENU") {
      osc1.frequency.value = 110;
      osc2.frequency.value = 110.5;
    } else if (theme === "GAMEPLAY") {
      osc1.frequency.value = 146.83;
      osc2.frequency.value = 147.5;
    } else if (theme === "BOSS") {
      osc1.frequency.value = 82.41;
      osc2.frequency.value = 83;
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";
    }

    const mGain = this.audioCtx.createGain();
    mGain.gain.value = 0.1;
    
    osc1.connect(mGain);
    osc2.connect(mGain);
    mGain.connect(this.musicGain);
    
    osc1.start();
    osc2.start();
    
    this.currentMusicOscillators.push(osc1, osc2);
  }

  public stopMusic() {
    this.currentMusicOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.currentMusicOscillators = [];
  }
}
