export interface Upgrades {
  launchThrusters: number;
  chronoEfficiency: number;
  chronoSiphon: number;
  elasticHull: number;
  frictionlessCoating: number;
}

export interface LifetimeStats {
  totalRuns: number;
  totalPlayTimeMs: number;
  totalTurretsDestroyed: number;
  totalPerfectWaves: number;
  highestScore: number;
  highestWave: number;
  highestComboMultiplier: number;
  highestComboKills: number;
  lifetimeChronoEnergyUsed: number;
  lifetimeChronoEnergyRecovered: number;
}

export interface PlayerProfile {
  playerLevel: number;
  currentXP: number;
}

export interface Achievements {
  firstBlood: boolean;
  waveRider: boolean;
  chronoMaster: boolean;
  perfectExecution: boolean;
  coreCollector: boolean;
  pinballGod: boolean;
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export interface SaveData {
  version: number;
  cores: number;
  lifetimeCores: number;
  upgrades: Upgrades;
  stats: LifetimeStats;
  profile: PlayerProfile;
  achievements: Achievements;
  audioSettings?: AudioSettings;
  
  // Legacy fields for migration backing
  highestScore?: number;
  highestWave?: number;
  runsPlayed?: number;
  totalTurretsDestroyed?: number;
}

const STORAGE_KEY = 'chrono_pinball_save';
const CURRENT_SAVE_VERSION = 2;

const defaultSaveData: SaveData = {
  version: CURRENT_SAVE_VERSION,
  cores: 0,
  lifetimeCores: 0,
  upgrades: {
    launchThrusters: 0,
    chronoEfficiency: 0,
    chronoSiphon: 0,
    elasticHull: 0,
    frictionlessCoating: 0,
  },
  stats: {
    totalRuns: 0,
    totalPlayTimeMs: 0,
    totalTurretsDestroyed: 0,
    totalPerfectWaves: 0,
    highestScore: 0,
    highestWave: 0,
    highestComboMultiplier: 1.0,
    highestComboKills: 0,
    lifetimeChronoEnergyUsed: 0,
    lifetimeChronoEnergyRecovered: 0,
  },
  profile: {
    playerLevel: 1,
    currentXP: 0,
  },
  achievements: {
    firstBlood: false,
    waveRider: false,
    chronoMaster: false,
    perfectExecution: false,
    coreCollector: false,
    pinballGod: false,
  }
};

export const SaveSystem = {
  load(): SaveData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        let parsed = JSON.parse(data);
        
        // Save Version Migration Logic
        if (!parsed.version || parsed.version < 2) {
          parsed.stats = {
            ...defaultSaveData.stats,
            totalRuns: parsed.runsPlayed || 0,
            highestScore: parsed.highestScore || 0,
            highestWave: parsed.highestWave || 0,
            totalTurretsDestroyed: parsed.totalTurretsDestroyed || 0,
          };
          parsed.profile = { ...defaultSaveData.profile };
          parsed.achievements = { ...defaultSaveData.achievements };
          parsed.version = CURRENT_SAVE_VERSION;
          
          delete parsed.runsPlayed;
          delete parsed.highestScore;
          delete parsed.highestWave;
          delete parsed.totalTurretsDestroyed;
        }

        return {
          ...defaultSaveData,
          ...parsed,
          upgrades: {
            ...defaultSaveData.upgrades,
            ...(parsed.upgrades || {})
          },
          stats: {
            ...defaultSaveData.stats,
            ...(parsed.stats || {})
          },
          profile: {
            ...defaultSaveData.profile,
            ...(parsed.profile || {})
          },
          achievements: {
            ...defaultSaveData.achievements,
            ...(parsed.achievements || {})
          }
        };
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
    }
    return JSON.parse(JSON.stringify(defaultSaveData));
  },

  addXP(save: SaveData, xpEarned: number): SaveData {
    let playerLevel = save.profile?.playerLevel || 1;
    let currentXP = save.profile?.currentXP || 0;
    currentXP += xpEarned;
    
    // Level N requires 100 * N XP to level up
    while (currentXP >= 100 * playerLevel) {
      currentXP -= 100 * playerLevel;
      playerLevel++;
    }
    
    return {
      ...save,
      profile: {
        playerLevel,
        currentXP
      }
    };
  },

  save(data: SaveData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
       console.warn('Failed to save data:', e);
    }
  },
  
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear save data:', e);
    }
  }
};
