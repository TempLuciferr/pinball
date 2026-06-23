import { Upgrades } from "./SaveSystem";
import { AudioManager } from "./AudioManager";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  hp: number;
  maxHp: number;
}

export interface Mine {
  pos: Vector2;
  radius: number;
  active: boolean;
  armed: boolean;
  lifeTime: number;
}

export interface Turret {
  pos: Vector2;
  vel?: Vector2;
  angle: number;
  fireCooldown: number;
  fireRate: number;
  radius: number;
  type: "BASIC" | "SPREAD" | "DRIFTER" | "PULSAR" | "TRACKER" | "SHIELD_EMITTER" | "BURST_SNIPER" | "MINE_LAYER" | "BOSS_JUGGERNAUT" | "BOSS_TWIN_CORE_A" | "BOSS_TWIN_CORE_B" | "BOSS_CHRONO_CORE";
  isShielded?: boolean;
  hitFlashTimer?: number;

  // BURST_SNIPER
  sniperState?: "IDLE" | "AIMING" | "FIRING" | "COOLDOWN";
  sniperTimer?: number;
  sniperTargetAngle?: number;
  sniperShotsFired?: number;

  // MINE_LAYER
  mineTimer?: number;

  // BOSS
  hp?: number;
  maxHp?: number;
  
  // JUGGERNAUT
  stateTimer?: number;
  attackMode?: "BASIC" | "SPREAD";
  drifterTimer?: number;
  
  // TWIN CORES
  isShieldDisabled?: boolean;
  shieldDisableTimer?: number;
  
  // CHRONO ENGINE
  attackTimer?: number;
  orbitAngle?: number;
}

export interface Bullet {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  active: boolean;
  type?: "NORMAL" | "MISSILE";
  angle?: number;
  lifetime?: number;
}

export interface Bumper {
  pos: Vector2;
  radius: number;
}

export interface Particle {
  pos: Vector2;
  vel: Vector2;
  life: number;
  maxLife: number;
  color: string;
  type?: "DOT" | "RING";
  radius?: number;
}

export interface FloatingText {
  pos: Vector2;
  text: string;
  life: number;
  maxLife: number;
  color: string;
  scale: number;
}

export interface GameState {
  player: Player;
  isDragging: boolean;
  dragStart: Vector2 | null;
  dragCurrent: Vector2 | null;
  bounds: { width: number; height: number };
  turrets: Turret[];
  bullets: Bullet[];
  bumpers: Bumper[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  screenShake: number;
  mines: Mine[];
  runTimeMs: number;
  wave: number;
  turretsDestroyed: number;
  enemiesLeft: number;
  waveState: "PLAYING" | "CLEAR_WAIT";
  waveTimer: number;
  chronoEnergy: number;
  totalChronoUsed: number;
  totalChronoRecovered: number;
  
  // Real Score System
  score: number;
  highestSingleKill: number;
  totalBounceBonuses: number;
  perfectWaves: number;

  // Combo System
  currentComboMultiplier: number;
  _killsThisLaunch: number;
  highestComboReached: number;
  highestComboMultiplier: number;
  totalComboBonusEarned: number;
  _isLaunching: boolean;

  // Internal Tracking Variables
  _currentWaveDamageTaken: number;
  _currentBouncesBeforeKill: number;
}

export class GameEngine {
  public state: GameState;

  // Upgrade state
  private upgrades?: Upgrades;

  // Physics parameters
  private damping = 0.985;
  private stopThreshold = 0.1;
  private bounceFactor = 0.8;
  public maxDragDistance = 150;
  private launchForceMultiplier = 0.15; // tuning the slingshot strength

  constructor(width: number, height: number, upgrades?: Upgrades) {
    this.upgrades = upgrades;
    
    if (upgrades) {
      this.launchForceMultiplier += upgrades.launchThrusters * 0.01;
      this.damping += upgrades.frictionlessCoating * 0.002;
      this.bounceFactor += upgrades.elasticHull * 0.04;
    }

    this.state = {
      bounds: { width, height },
      player: {
        pos: { x: width / 2, y: height / 2 },
        vel: { x: 0, y: 0 },
        radius: 20,
        hp: 5,
        maxHp: 5,
      },
      isDragging: false,
      dragStart: null,
      dragCurrent: null,
      turrets: [],
      bullets: [],
      bumpers: [],
      particles: [],
      floatingTexts: [],
      screenShake: 0,
      mines: [],
      runTimeMs: 0,
      wave: 1,
      turretsDestroyed: 0,
      enemiesLeft: 0,
      waveState: "PLAYING",
      waveTimer: 0,
      chronoEnergy: 100,
      totalChronoUsed: 0,
      totalChronoRecovered: 0,

      // Score initialization
      score: 0,
      highestSingleKill: 0,
      totalBounceBonuses: 0,
      perfectWaves: 0,

      // Combo initialization
      currentComboMultiplier: 1.0,
      _killsThisLaunch: 0,
      highestComboReached: 0,
      highestComboMultiplier: 1.0,
      totalComboBonusEarned: 0,
      _isLaunching: false,

      // Internal Tracking Variables
      _currentWaveDamageTaken: 0,
      _currentBouncesBeforeKill: 0,
    };

    this.spawnWave(1);
  }

  private spawnWave(waveNumber: number) {
    let config = { basic: 1, spread: 0, drifter: 0, pulsar: 0, tracker: 0, shieldEmitter: 0, burstSniper: 0, mineLayer: 0 };
    
    // Check Boss Waves First
    if (waveNumber === 15 || waveNumber === 30 || waveNumber === 50) {
      this.state.bumpers = [];
      this.state.turrets = [];
      
      const cx = this.state.bounds.width / 2;
      const cy = this.state.bounds.height / 2;

      if (waveNumber === 15) {
        this.state.turrets.push({
          pos: { x: cx, y: cy },
          angle: 0, fireCooldown: 1000, fireRate: 1000, radius: 60,
          type: "BOSS_JUGGERNAUT", hp: 15, maxHp: 15,
          stateTimer: 0, attackMode: "BASIC", drifterTimer: 5000
        });
      } else if (waveNumber === 30) {
        this.state.turrets.push({
          pos: { x: this.state.bounds.width * 0.3, y: cy },
          angle: 0, fireCooldown: 1500, fireRate: 1500, radius: 50,
          type: "BOSS_TWIN_CORE_A", hp: 20, maxHp: 20,
          isShieldDisabled: false, shieldDisableTimer: 0
        });
        this.state.turrets.push({
          pos: { x: this.state.bounds.width * 0.7, y: cy },
          angle: 0, fireCooldown: 0, fireRate: 0, radius: 40,
          type: "BOSS_TWIN_CORE_B"
        });
      } else if (waveNumber === 50) {
        this.state.turrets.push({
          pos: { x: cx, y: cy },
          angle: 0, fireCooldown: 1000, fireRate: 1000, radius: 50,
          type: "BOSS_CHRONO_CORE", hp: 30, maxHp: 30,
          attackTimer: 0, orbitAngle: 0
        });
        const d = 150;
        this.state.bumpers.push({ pos: { x: cx - d, y: cy - d }, radius: 25 });
        this.state.bumpers.push({ pos: { x: cx + d, y: cy - d }, radius: 25 });
        this.state.bumpers.push({ pos: { x: cx - d, y: cy + d }, radius: 25 });
        this.state.bumpers.push({ pos: { x: cx + d, y: cy + d }, radius: 25 });
      }
      
      this.state.enemiesLeft = this.state.turrets.filter(t => t.hp !== undefined).length;
      return;
    }

    if (waveNumber <= 3) {
      config = { basic: Math.min(3, waveNumber), spread: 0, drifter: 0, pulsar: 0, tracker: 0, shieldEmitter: 0, burstSniper: 0, mineLayer: 0 };
    } else if (waveNumber <= 7) {
      config = {
        basic: waveNumber <= 5 ? 2 : 3,
        spread: 0,
        drifter: waveNumber <= 5 ? waveNumber - 3 : waveNumber - 4,
        pulsar: 0,
        tracker: 0,
        shieldEmitter: 0,
        burstSniper: 0,
        mineLayer: 0
      };
    } else if (waveNumber <= 11) {
      config = {
        basic: waveNumber <= 9 ? 2 : 3,
        spread: waveNumber <= 8 ? 1 : 2,
        drifter: 0,
        pulsar: waveNumber <= 10 ? 1 : 2,
        tracker: 0,
        shieldEmitter: 0,
        burstSniper: 0,
        mineLayer: 0
      };
    } else if (waveNumber <= 14) {
      const scaling = Math.floor((waveNumber - 12) / 3);
      config = {
        basic: Math.min(4, 2 + scaling),
        spread: Math.min(3, 2 + scaling),
        drifter: 0,
        pulsar: Math.min(3, 1 + scaling),
        tracker: Math.min(3, 1 + Math.floor((waveNumber - 12) / 4)),
        shieldEmitter: 0,
        burstSniper: 0,
        mineLayer: 0
      };
    } else {
      // Wave 16+
      config = {
        basic: Math.max(1, Math.floor(Math.random() * 3) + 2), // 2-4
        spread: Math.floor(Math.random() * 3) + 1, // 1-3
        drifter: waveNumber >= 18 ? 1 : 0,
        pulsar: Math.floor(Math.random() * 2) + 1, // 1-2
        tracker: Math.floor(Math.random() * 2) + 1, // 1-2
        shieldEmitter: waveNumber >= 20 ? (Math.random() > 0.5 ? 2 : 1) : (waveNumber >= 16 ? 1 : 0),
        burstSniper: waveNumber >= 22 ? Math.min(2, Math.floor(Math.random() * 2) + 1) : 0,
        mineLayer: waveNumber >= 28 ? Math.min(2, Math.floor(Math.random() * 2) + 1) : 0
      };
    }

    this.state.bumpers = [];
    const bumperCount =
      waveNumber === 1 ? 0 : waveNumber <= 3 ? 1 : waveNumber <= 5 ? 2 : 3;
    const padding = 60;
    const widthRange = Math.max(1, this.state.bounds.width - padding * 2);
    const heightRange = Math.max(1, this.state.bounds.height - padding * 2);

    for (let b = 0; b < bumperCount; b++) {
      const radius = 30;
      for (let attempt = 0; attempt < 50; attempt++) {
        const x = padding + Math.random() * widthRange;
        const y = padding + Math.random() * heightRange;

        // Check against player
        const distToPlayer = Math.hypot(
          x - this.state.player.pos.x,
          y - this.state.player.pos.y,
        );
        if (distToPlayer < this.state.player.radius + radius + 100) continue;

        // Check against existing bumpers
        let safe = true;
        for (const bumper of this.state.bumpers) {
          const distToBumper = Math.hypot(x - bumper.pos.x, y - bumper.pos.y);
          if (distToBumper < bumper.radius + radius + 40) {
            safe = false;
            break;
          }
        }

        if (safe) {
          this.state.bumpers.push({ pos: { x, y }, radius });
          break;
        }
      }
    }

    const trySpawn = (type: Turret["type"], initialCooldown: number) => {
      let radius = 24;
      let fireRate = 2500;
      let vel: Vector2 | undefined = undefined;
      
      if (type === "DRIFTER") {
        radius = 20;
      } else if (type === "PULSAR") {
        radius = 28;
        fireRate = 3500;
      } else if (type === "TRACKER") {
        radius = 26;
        fireRate = 4000;
      } else if (type === "SHIELD_EMITTER") {
        radius = 24;
      } else if (type === "BURST_SNIPER") {
        radius = 24;
      } else if (type === "MINE_LAYER") {
        radius = 22;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.05;
        vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      }

      // Try 50 times to find a safe spot
      for (let attempt = 0; attempt < 50; attempt++) {
        const x = padding + Math.random() * widthRange;
        const y = padding + Math.random() * heightRange;

        // Check against player
        const distToPlayer = Math.hypot(
          x - this.state.player.pos.x,
          y - this.state.player.pos.y,
        );
        if (distToPlayer < this.state.player.radius + radius + 100) continue;

        // Check against existing bumpers
        let safe = true;
        for (const bumper of this.state.bumpers) {
          const distToBumper = Math.hypot(x - bumper.pos.x, y - bumper.pos.y);
          if (distToBumper < bumper.radius + radius + 20) {
            safe = false;
            break;
          }
        }
        if (!safe) continue;

        // Check against existing turrets
        for (const t of this.state.turrets) {
          const distToTurret = Math.hypot(x - t.pos.x, y - t.pos.y);
          if (distToTurret < t.radius + radius + 20) {
            safe = false;
            break;
          }
        }
        
        if (safe && type === "BURST_SNIPER") {
          for (const t of this.state.turrets) {
            if (t.type === "SHIELD_EMITTER" && Math.hypot(x - t.pos.x, y - t.pos.y) < 160) {
              safe = false;
              break;
            }
          }
        }

        if (safe) {
          this.state.turrets.push({
            pos: { x, y },
            vel,
            angle: 0,
            fireCooldown: initialCooldown,
            fireRate,
            radius,
            type,
            sniperState: type === "BURST_SNIPER" ? "IDLE" : undefined,
            sniperTimer: type === "BURST_SNIPER" ? 0 : undefined,
            mineTimer: type === "MINE_LAYER" ? 3500 : undefined,
          });
          return; // Spawned successfully
        }
      }
      // If we couldn't find a safe spot after 50 attempts, force spawn
      this.state.turrets.push({
        pos: {
          x: padding + Math.random() * widthRange,
          y: padding + Math.random() * heightRange,
        },
        vel,
        angle: 0,
        fireCooldown: initialCooldown,
        fireRate,
        radius,
        type,
        sniperState: type === "BURST_SNIPER" ? "IDLE" : undefined,
        sniperTimer: type === "BURST_SNIPER" ? 0 : undefined,
        mineTimer: type === "MINE_LAYER" ? 3500 : undefined,
      });
    };

    let cooldownOffset = 1000;
    for (let i = 0; i < config.basic; i++) {
      trySpawn("BASIC", cooldownOffset);
      cooldownOffset += 500;
    }
    for (let i = 0; i < config.spread; i++) {
      trySpawn("SPREAD", cooldownOffset);
      cooldownOffset += 500;
    }
    for (let i = 0; i < config.drifter; i++) {
      trySpawn("DRIFTER", cooldownOffset);
      cooldownOffset += 200;
    }
    for (let i = 0; i < config.pulsar; i++) {
      trySpawn("PULSAR", cooldownOffset);
      cooldownOffset += 700;
    }
    for (let i = 0; i < config.tracker; i++) {
      trySpawn("TRACKER", cooldownOffset);
      cooldownOffset += 800;
    }
    for (let i = 0; i < config.shieldEmitter; i++) {
      trySpawn("SHIELD_EMITTER", cooldownOffset);
      cooldownOffset += 500;
    }
    for (let i = 0; i < config.burstSniper; i++) {
      trySpawn("BURST_SNIPER", cooldownOffset);
      cooldownOffset += 500;
    }
    for (let i = 0; i < config.mineLayer; i++) {
      trySpawn("MINE_LAYER", cooldownOffset);
      cooldownOffset += 500;
    }
  }

  private spawnFloatingText(x: number, y: number, text: string, color: string = "#FFFFFF", scale: number = 1.0) {
    this.state.floatingTexts.push({
      pos: { x, y },
      text,
      life: 0,
      maxLife: 800,
      color,
      scale
    });
    if (this.state.floatingTexts.length > 20) {
      this.state.floatingTexts.shift();
    }
  }

  private addScreenShake(intensity: number) {
    this.state.screenShake = Math.max(this.state.screenShake, intensity);
  }

  private spawnExplosion(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.4 + 0.1;
      this.state.particles.push({
        pos: { x, y },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0,
        maxLife: 400 + Math.random() * 300,
        color: "#FF1744",
        type: "DOT"
      });
    }
    if (this.state.particles.length > 200) {
      this.state.particles.splice(0, this.state.particles.length - 200);
    }
  }

  private spawnRingExplosion(x: number, y: number) {
     this.state.particles.push({
        pos: { x, y },
        vel: { x: 0, y: 0 },
        life: 0,
        maxLife: 600,
        color: "#FFC400",
        type: "RING",
        radius: 0
     });
     for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.3 + 0.1;
      this.state.particles.push({
        pos: { x, y },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0,
        maxLife: 500 + Math.random() * 200,
        color: "#FFC400",
        type: "DOT"
      });
    }
    if (this.state.particles.length > 200) {
      this.state.particles.splice(0, this.state.particles.length - 200);
    }
  }

  public setBounds(width: number, height: number) {
    this.state.bounds = { width, height };
    // Keep player in bounds if they resize
    this.state.player.pos.x = Math.max(
      this.state.player.radius,
      Math.min(
        this.state.bounds.width - this.state.player.radius,
        this.state.player.pos.x,
      ),
    );
    this.state.player.pos.y = Math.max(
      this.state.player.radius,
      Math.min(
        this.state.bounds.height - this.state.player.radius,
        this.state.player.pos.y,
      ),
    );
  }

  public handlePointerDown(x: number, y: number) {
    // Only allow drag if almost stopped and has chrono energy
    const speed = Math.hypot(this.state.player.vel.x, this.state.player.vel.y);
    if (speed < 1 && this.state.chronoEnergy > 0) {
      this.state.isDragging = true;
      this.state.dragStart = { x, y };
      this.state.dragCurrent = { x, y };
      AudioManager.getInstance().playSFX("chrono_activate");
    }
  }

  public handlePointerMove(x: number, y: number) {
    if (this.state.isDragging) {
      this.state.dragCurrent = { x, y };
    }
  }

  public handlePointerUp() {
    if (
      this.state.isDragging &&
      this.state.dragStart &&
      this.state.dragCurrent
    ) {
      // Calculate drag vector
      let dx = this.state.dragCurrent.x - this.state.dragStart.x;
      let dy = this.state.dragCurrent.y - this.state.dragStart.y;

      const dist = Math.hypot(dx, dy);
      if (dist > this.maxDragDistance) {
        dx = (dx / dist) * this.maxDragDistance;
        dy = (dy / dist) * this.maxDragDistance;
      }

      // Apply velocity opposite to drag
      this.state.player.vel.x = -dx * this.launchForceMultiplier;
      this.state.player.vel.y = -dy * this.launchForceMultiplier;

      // Start combo tracking for this launch
      this.state._killsThisLaunch = 0;
      this.state.currentComboMultiplier = 1.0;
      this.state._isLaunching = true;
      AudioManager.getInstance().playSFX("player_launch");
    }

    this.state.isDragging = false;
    this.state.dragStart = null;
    this.state.dragCurrent = null;
  }

  public update(dtMs: number) {
    const p = this.state.player;
    const b = this.state.bounds;

    if (!this.state.isDragging) {
      // Basic euler integration
      p.pos.x += p.vel.x * (dtMs / 16);
      p.pos.y += p.vel.y * (dtMs / 16);

      p.vel.x *= Math.pow(this.damping, dtMs / 16);
      p.vel.y *= Math.pow(this.damping, dtMs / 16);

      const speed = Math.hypot(p.vel.x, p.vel.y);
      if (speed < this.stopThreshold) {
        p.vel.x = 0;
        p.vel.y = 0;

        if (this.state._isLaunching) {
          this.state._isLaunching = false;
          this.state._killsThisLaunch = 0;
          this.state.currentComboMultiplier = 1.0;
        }
      }

      // Collisions
      let wallBounced = false;
      if (p.pos.x - p.radius < 0) {
        p.pos.x = p.radius;
        p.vel.x = -p.vel.x * this.bounceFactor;
        this.state._currentBouncesBeforeKill++;
        wallBounced = true;
      } else if (p.pos.x + p.radius > b.width) {
        p.pos.x = b.width - p.radius;
        p.vel.x = -p.vel.x * this.bounceFactor;
        this.state._currentBouncesBeforeKill++;
        wallBounced = true;
      }

      if (p.pos.y - p.radius < 0) {
        p.pos.y = p.radius;
        p.vel.y = -p.vel.y * this.bounceFactor;
        this.state._currentBouncesBeforeKill++;
        wallBounced = true;
      } else if (p.pos.y + p.radius > b.height) {
        p.pos.y = b.height - p.radius;
        p.vel.y = -p.vel.y * this.bounceFactor;
        this.state._currentBouncesBeforeKill++;
        wallBounced = true;
      }
      
      if (wallBounced) {
        AudioManager.getInstance().playSFX("wall");
      }

      // Player vs Bumpers
      for (const bumper of this.state.bumpers) {
        const dx = p.pos.x - bumper.pos.x;
        const dy = p.pos.y - bumper.pos.y;
        const dist = Math.hypot(dx, dy);
        const minDist = p.radius + bumper.radius;

        if (dist < minDist && dist > 0) {
          // Resolve penetration
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          p.pos.x += nx * overlap;
          p.pos.y += ny * overlap;

          // Elastic bounce
          const dotProduct = p.vel.x * nx + p.vel.y * ny;
          if (dotProduct < 0) {
            const restitution = 1.0; // Elastic collision
            p.vel.x -= (1 + restitution) * dotProduct * nx;
            p.vel.y -= (1 + restitution) * dotProduct * ny;
            this.state._currentBouncesBeforeKill++;
            AudioManager.getInstance().playSFX("bumper");
          }
        }
      }
    }

    if (this.state.isDragging) {
      const effLevel = this.upgrades?.chronoEfficiency || 0;
      const energyDrain = (25 - (effLevel * 2)) * (dtMs / 1000);
      this.state.chronoEnergy -= energyDrain;
      this.state.totalChronoUsed += energyDrain;

      if (this.state.chronoEnergy <= 0) {
        this.state.chronoEnergy = 0;
        AudioManager.getInstance().playSFX("chrono_exhausted");
        // Force launch
        this.handlePointerUp();
      }
    }

    const timeScale = this.state.isDragging ? 0.1 : 1.0;
    const scaledDtMs = dtMs * timeScale;

    // Reset shield states
    for (const t of this.state.turrets) {
      t.isShielded = false;
    }
    // Apply shields
    for (const emitter of this.state.turrets) {
      if (emitter.type === "SHIELD_EMITTER") {
        for (const t of this.state.turrets) {
          if (t.type === "BASIC" || t.type === "SPREAD" || t.type === "PULSAR" || t.type === "TRACKER") {
            const dx = t.pos.x - emitter.pos.x;
            const dy = t.pos.y - emitter.pos.y;
            if (Math.hypot(dx, dy) <= 150) {
              t.isShielded = true;
            }
          }
        }
      }
    }

    // Update Turrets and Check Player Collision
    for (let i = this.state.turrets.length - 1; i >= 0; i--) {
      const t = this.state.turrets[i];

      if (t.hitFlashTimer !== undefined && t.hitFlashTimer > 0) {
        t.hitFlashTimer = Math.max(0, t.hitFlashTimer - scaledDtMs);
      }

      // Check collision with player
      let dx = p.pos.x - t.pos.x;
      let dy = p.pos.y - t.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < p.radius + t.radius) {
        if (t.type.startsWith("BOSS_")) {
          if (t.type === "BOSS_TWIN_CORE_B") {
            for (const boss of this.state.turrets) {
              if (boss.type === "BOSS_TWIN_CORE_A") {
                boss.isShieldDisabled = true;
                boss.shieldDisableTimer = 4000;
              }
            }
          } else if (t.type === "BOSS_TWIN_CORE_A" && !t.isShieldDisabled) {
             // Immune
          } else {
             if (t.hp !== undefined) {
               t.hp -= 1;
               AudioManager.getInstance().playSFX("boss_hit");
               t.hitFlashTimer = 100;
               this.addScreenShake(3);
               this.spawnFloatingText(p.pos.x, p.pos.y - 30, "+100", "#FF4081");
               this.state.score += 100;
               this.spawnExplosion(p.pos.x, p.pos.y);
               if (t.hp <= 0) {
                 AudioManager.getInstance().playSFX("boss_death");
                 this.addScreenShake(8);
                 this.spawnFloatingText(t.pos.x, t.pos.y, "+10000", "#FFD54F", 1.5);
                 this.state.turrets.splice(i, 1);
                 if (t.type === "BOSS_TWIN_CORE_A") {
                   const idxB = this.state.turrets.findIndex(tt => tt.type === "BOSS_TWIN_CORE_B");
                   if (idxB !== -1) {
                     this.state.turrets.splice(idxB, 1);
                     if (idxB < i) {
                       i--;
                     }
                   }
                 } else if (t.type === "BOSS_JUGGERNAUT") {
                   // Destroy all drifters
                   for (let d = this.state.turrets.length - 1; d >= 0; d--) {
                     if (this.state.turrets[d].type === "DRIFTER") {
                       this.spawnExplosion(this.state.turrets[d].pos.x, this.state.turrets[d].pos.y);
                       this.state.turrets.splice(d, 1);
                       if (d < i) {
                         i--;
                       }
                     }
                   }
                 } else if (t.type === "BOSS_CHRONO_CORE") {
                   for (const m of this.state.mines) this.spawnRingExplosion(m.pos.x, m.pos.y);
                   this.state.mines = [];
                   this.state.bullets = [];
                 }
                 this.state.score += 10000;
                 
                 const prevEnergy = this.state.chronoEnergy;
                 this.state.chronoEnergy = Math.min(100, this.state.chronoEnergy + 50);
                 this.state.totalChronoRecovered += this.state.chronoEnergy - prevEnergy;
                 if (this.state.chronoEnergy > prevEnergy) {
                   this.spawnFloatingText(t.pos.x, t.pos.y - 20, "+50 CHRONO", "#00E5FF");
                   AudioManager.getInstance().playSFX("chrono_recovery");
                 }
               }
             }
          }

          // Bounce player off boss
          const safeDist = dist === 0 ? 1 : dist;
          const safeDx = dist === 0 ? 1 : dx;
          const safeDy = dist === 0 ? 0 : dy;
          const nx = safeDx / safeDist;
          const ny = safeDy / safeDist;
          const pen = p.radius + t.radius - safeDist;
          if (pen > 0) {
            p.pos.x += nx * pen;
            p.pos.y += ny * pen;
          }
          const dot = p.vel.x * nx + p.vel.y * ny;
          if (dot < 0) {
            p.vel.x -= (1 + 0.8) * dot * nx;
            p.vel.y -= (1 + 0.8) * dot * ny;
          }
          continue;
        }

        if (t.type === "DRIFTER") {
          p.hp -= 1;
          AudioManager.getInstance().playSFX("player_damage");
          this.state._currentWaveDamageTaken++;
          this.state.turrets.splice(i, 1);
          this.spawnExplosion(t.pos.x, t.pos.y);
          
          // Bounce player slightly away
          const safeDist = dist === 0 ? 1 : dist;
          const safeDx = dist === 0 ? 1 : dx;
          const safeDy = dist === 0 ? 0 : dy;
          const nx = safeDx / safeDist;
          const ny = safeDy / safeDist;
          p.vel.x = nx * 0.5;
          p.vel.y = ny * 0.5;
          continue;
        }

        if (t.isShielded) {
          const safeDist = dist === 0 ? 1 : dist;
          const safeDx = dist === 0 ? 1 : dx;
          const safeDy = dist === 0 ? 0 : dy;
          const nx = safeDx / safeDist;
          const ny = safeDy / safeDist;
          
          // Resolve penetration
          const pen = p.radius + t.radius - safeDist;
          p.pos.x += nx * pen;
          p.pos.y += ny * pen;
          
          // Reflect velocity
          const dot = p.vel.x * nx + p.vel.y * ny;
          if (dot < 0) {
            const restitution = 0.8;
            p.vel.x -= (1 + restitution) * dot * nx;
            p.vel.y -= (1 + restitution) * dot * ny;
          }
          continue; // Enemy survives, no score
        }
        
        // Destroy turret
        const deathPos = { ...t.pos };
        this.state.turrets.splice(i, 1);
        this.state.turretsDestroyed++;
        AudioManager.getInstance().playSFX("turret_kill");

        // Calculate Kill Score
        let baseKillScore = 100;
        const bounceBonus = Math.min(this.state._currentBouncesBeforeKill * 50, 200);
        this.state.totalBounceBonuses += bounceBonus;
        baseKillScore += bounceBonus;
        
        const chronoBonus = Math.floor((this.state.chronoEnergy / 100) * 30);
        baseKillScore += chronoBonus;

        // Apply Combo
        const oldCombo = this.state.currentComboMultiplier;
        this.state._killsThisLaunch++;
        this.state.currentComboMultiplier = Math.min(1.0 + ((this.state._killsThisLaunch - 1) * 0.5), 3.0);
        
        if (this.state._killsThisLaunch > this.state.highestComboReached) {
          this.state.highestComboReached = this.state._killsThisLaunch;
        }
        if (this.state.currentComboMultiplier > this.state.highestComboMultiplier) {
          this.state.highestComboMultiplier = this.state.currentComboMultiplier;
        }

        const finalKillScore = Math.round(baseKillScore * this.state.currentComboMultiplier);
        const comboBonus = finalKillScore - baseKillScore;
        this.state.totalComboBonusEarned += comboBonus;

        this.state.score += finalKillScore;
        if (finalKillScore > this.state.highestSingleKill) {
          this.state.highestSingleKill = finalKillScore;
        }

        // Reset tracking vars
        this.state._currentBouncesBeforeKill = 0;

        // Chrono Recovery
        const siphonLevel = this.upgrades?.chronoSiphon || 0;
        const recoveryAmount = Math.min(50, 30 + (siphonLevel * 5));
        const prevEnergy = this.state.chronoEnergy;
        this.state.chronoEnergy = Math.min(100, this.state.chronoEnergy + recoveryAmount);
        this.state.totalChronoRecovered += this.state.chronoEnergy - prevEnergy;
        if (this.state.chronoEnergy > prevEnergy) AudioManager.getInstance().playSFX("chrono_recovery");

        this.spawnExplosion(deathPos.x, deathPos.y);
        this.addScreenShake(2);
        this.spawnFloatingText(deathPos.x, deathPos.y, "+" + finalKillScore, "#FFFFFF");
        
        if (bounceBonus > 0) {
          this.spawnFloatingText(deathPos.x, deathPos.y - 15, "BOUNCE BONUS", "#40C4FF", 0.8);
        }
        
        if (this.state.currentComboMultiplier > oldCombo) {
          this.spawnFloatingText(p.pos.x, p.pos.y - 40, this.state.currentComboMultiplier.toFixed(1) + "X COMBO", "#FFD54F", 1.2);
        }
        
        // Bounce player slightly away
        // Prevent div-by-zero if somehow positions match exactly
        const safeDist = dist === 0 ? 1 : dist;
        const safeDx = dist === 0 ? 1 : dx;
        const safeDy = dist === 0 ? 0 : dy;
        const nx = safeDx / safeDist;
        const ny = safeDy / safeDist;
        p.vel.x = nx * 0.5;
        p.vel.y = ny * 0.5;
        continue;
      }

      if (t.type === "DRIFTER") {
        t.angle = Math.atan2(dy, dx); // Note dx, dy are player - turret
        const moveSpeed = 0.04;
        t.pos.x += Math.cos(t.angle) * moveSpeed * scaledDtMs;
        t.pos.y += Math.sin(t.angle) * moveSpeed * scaledDtMs;
        t.pos.x = Math.max(t.radius, Math.min(this.state.bounds.width - t.radius, t.pos.x));
        t.pos.y = Math.max(t.radius, Math.min(this.state.bounds.height - t.radius, t.pos.y));
        continue;
      }
      
      if (t.type === "SHIELD_EMITTER") {
        continue;
      }
      
      if (t.type === "BURST_SNIPER") {
        if (!t.sniperState) {
          t.sniperState = "IDLE";
          t.sniperTimer = 0;
        }
        t.sniperTimer += scaledDtMs;
        
        if (t.sniperState === "IDLE" && t.sniperTimer >= 2000) {
           t.sniperState = "AIMING";
           t.sniperTimer = 0;
           t.sniperTargetAngle = Math.atan2(dy, dx);
        } else if (t.sniperState === "AIMING") {
           if (t.sniperTimer >= 2000) {
             t.sniperState = "FIRING";
             t.sniperTimer = 0;
             t.sniperShotsFired = 0;
           }
        } else if (t.sniperState === "FIRING") {
           if (t.sniperTimer >= 100) {
             t.sniperTimer = 0;
             t.sniperShotsFired = (t.sniperShotsFired || 0) + 1;
             const angle = t.sniperTargetAngle || 0;
             let activeBullets = 0;
             for(let j = 0; j < this.state.bullets.length; j++) {
               if (this.state.bullets[j].active) activeBullets++;
             }
             if (activeBullets < 60) {
               this.state.bullets.push({
                 pos: { x: t.pos.x, y: t.pos.y },
                 vel: { x: Math.cos(angle)*1.0, y: Math.sin(angle)*1.0 },
                 radius: 3, active: true, type: "NORMAL"
               });
             }
             if (t.sniperShotsFired >= 3) {
                t.sniperState = "COOLDOWN";
                t.sniperTimer = 0;
             }
           }
        } else if (t.sniperState === "COOLDOWN") {
           if (t.sniperTimer >= 4000) {
              t.sniperState = "AIMING";
              t.sniperTimer = 0;
              t.sniperTargetAngle = Math.atan2(dy, dx);
           }
        }
        continue;
      }
      
      if (t.type === "MINE_LAYER") {
        t.angle += 0.002 * scaledDtMs;
        if (t.vel) {
          t.pos.x += t.vel.x * scaledDtMs;
          t.pos.y += t.vel.y * scaledDtMs;
          if (t.pos.x - t.radius < 0) { t.pos.x = t.radius; t.vel.x *= -1; }
          if (t.pos.x + t.radius > this.state.bounds.width) { t.pos.x = this.state.bounds.width - t.radius; t.vel.x *= -1; }
          if (t.pos.y - t.radius < 0) { t.pos.y = t.radius; t.vel.y *= -1; }
          if (t.pos.y + t.radius > this.state.bounds.height) { t.pos.y = this.state.bounds.height - t.radius; t.vel.y *= -1; }
        }
        
        t.mineTimer = (t.mineTimer || 0) - scaledDtMs;
        if (t.mineTimer <= 0) {
           t.mineTimer = 3500;
           this.state.mines.push({
             pos: { x: t.pos.x, y: t.pos.y },
             radius: 12, active: true, armed: false, lifeTime: 0
           });
           if (this.state.mines.length > 10) {
             this.state.mines.shift();
           }
        }
        continue;
      }
      
      if (t.type === "BOSS_TWIN_CORE_B") {
        t.angle += 0.001 * scaledDtMs;
        continue;
      }
      
      if (t.type === "BOSS_JUGGERNAUT") {
        t.angle = Math.atan2(dy, dx);
        t.stateTimer = (t.stateTimer || 0) + scaledDtMs;
        if (t.stateTimer > 4000) {
           t.stateTimer = 0;
           t.attackMode = t.attackMode === "BASIC" ? "SPREAD" : "BASIC";
        }
        
        t.drifterTimer = (t.drifterTimer || 0) - scaledDtMs;
        if (t.drifterTimer <= 0) {
           t.drifterTimer = 6000;
           for(let d=0; d<3; d++) {
             this.state.turrets.push({
               pos: { x: t.pos.x, y: t.pos.y },
               angle: 0, fireCooldown: 1000, fireRate: 2500, radius: 20, type: "DRIFTER"
             });
           }
        }
        
        t.fireCooldown -= scaledDtMs;
        if (t.fireCooldown <= 0) {
           t.fireCooldown = 800;
           let activeBullets = 0;
           for(let j = 0; j < this.state.bullets.length; j++) if (this.state.bullets[j].active) activeBullets++;
           if (activeBullets < 60) {
             const bulletSpeed = 0.4;
             if (t.attackMode === "BASIC") {
               this.state.bullets.push({
                 pos: { x: t.pos.x, y: t.pos.y }, vel: { x: Math.cos(t.angle)*bulletSpeed, y: Math.sin(t.angle)*bulletSpeed }, radius: 4, active: true, type: "NORMAL"
               });
             } else {
               const offset = 20 * (Math.PI / 180);
               [-offset, 0, offset].forEach(ang => {
                 this.state.bullets.push({
                   pos: { x: t.pos.x, y: t.pos.y }, vel: { x: Math.cos(t.angle + ang)*bulletSpeed, y: Math.sin(t.angle + ang)*bulletSpeed }, radius: 4, active: true, type: "NORMAL"
                 });
               });
             }
           }
        }
        continue;
      }
      
      if (t.type === "BOSS_TWIN_CORE_A") {
        t.angle = Math.atan2(dy, dx);
        if (t.isShieldDisabled) {
           t.shieldDisableTimer = (t.shieldDisableTimer || 0) - scaledDtMs;
           if (t.shieldDisableTimer <= 0) {
             t.isShieldDisabled = false;
           }
        }
        
        t.fireCooldown -= scaledDtMs;
        if (t.fireCooldown <= 0) {
           t.fireCooldown = 1500;
           let activeBullets = 0;
           for(let j = 0; j < this.state.bullets.length; j++) if (this.state.bullets[j].active) activeBullets++;
           if (activeBullets < 60) {
             this.state.bullets.push({
               pos: { x: t.pos.x, y: t.pos.y },
               vel: { x: Math.cos(t.angle)*0.2, y: Math.sin(t.angle)*0.2 },
               radius: 4, active: true, type: "MISSILE", angle: t.angle, lifetime: 3000
             });
           }
        }
        continue;
      }
      
      if (t.type === "BOSS_CHRONO_CORE") {
        t.orbitAngle = (t.orbitAngle || 0) + 0.0005 * scaledDtMs;
        const cx = t.pos.x;
        const cy = t.pos.y;
        if (this.state.bumpers.length >= 4) {
           for (let b = 0; b < 4; b++) {
             const ang = t.orbitAngle + (b * Math.PI / 2);
             this.state.bumpers[b].pos.x = cx + Math.cos(ang) * 150;
             this.state.bumpers[b].pos.y = cy + Math.sin(ang) * 150;
           }
        }
        
        t.attackTimer = (t.attackTimer || 0) + scaledDtMs;
        if (t.attackTimer > 3000) {
           t.attackTimer = 0;
           let activeBullets = 0;
           for(let j = 0; j < this.state.bullets.length; j++) if (this.state.bullets[j].active) activeBullets++;
           if (activeBullets < 60) {
             for (let bIdx = 0; bIdx < 12; bIdx++) {
               const angleOffsetRad = (bIdx / 12) * Math.PI * 2;
               this.state.bullets.push({
                 pos: { x: t.pos.x, y: t.pos.y },
                 vel: { x: Math.cos(angleOffsetRad) * 0.3, y: Math.sin(angleOffsetRad) * 0.3 },
                 radius: 4, active: true, type: "NORMAL"
               });
             }
           }
           this.state.mines.push({
             pos: { x: t.pos.x + (Math.random()-0.5)*200, y: t.pos.y + (Math.random()-0.5)*200 },
             radius: 12, active: true, armed: false, lifeTime: 0
           });
           if (this.state.mines.length > 10) this.state.mines.shift();
        }
        continue;
      }

      // Aim at player
      t.angle = Math.atan2(dy, dx);

      // Fire logic
      t.fireCooldown -= scaledDtMs;
      if (t.fireCooldown <= 0) {
        t.fireCooldown = t.fireRate;
        const bulletSpeed = t.type === "TRACKER" ? 0.2 : 0.4;
        
        // Count active bullets for cap
        let activeBullets = 0;
        for(let j = 0; j < this.state.bullets.length; j++) {
          if (this.state.bullets[j].active) activeBullets++;
        }
        
        if (activeBullets >= 60) continue; // Prevent mobile framerate collapse

        if (t.type === "PULSAR") {
          for (let bIdx = 0; bIdx < 12; bIdx++) {
            const angleOffsetRad = (bIdx / 12) * Math.PI * 2;
            this.state.bullets.push({
              pos: { x: t.pos.x, y: t.pos.y },
              vel: {
                x: Math.cos(angleOffsetRad) * bulletSpeed,
                y: Math.sin(angleOffsetRad) * bulletSpeed,
              },
              radius: 4,
              active: true,
              type: "NORMAL"
            });
          }
        } else if (t.type === "TRACKER") {
          this.state.bullets.push({
            pos: { x: t.pos.x, y: t.pos.y },
            vel: {
              x: Math.cos(t.angle) * bulletSpeed,
              y: Math.sin(t.angle) * bulletSpeed,
            },
            radius: 4,
            active: true,
            type: "MISSILE",
            angle: t.angle,
            lifetime: 3000
          });
        } else {
          const shootBullet = (angleOffsetRad: number) => {
            this.state.bullets.push({
              pos: { x: t.pos.x, y: t.pos.y },
              vel: {
                x: Math.cos(t.angle + angleOffsetRad) * bulletSpeed,
                y: Math.sin(t.angle + angleOffsetRad) * bulletSpeed,
              },
              radius: 4,
              active: true,
              type: "NORMAL"
            });
          };

          shootBullet(0);

          if (t.type === "SPREAD") {
            const offset = 15 * (Math.PI / 180);
            shootBullet(-offset);
            shootBullet(offset);
          }
        }
      }
    }

    // Update Mines
    for (let i = this.state.mines.length - 1; i >= 0; i--) {
      const m = this.state.mines[i];
      if (!m.active) continue;
      m.lifeTime += scaledDtMs;
      if (!m.armed && m.lifeTime >= 1000) {
        m.armed = true;
      }
      if (m.armed) {
        const distToPlayer = Math.hypot(p.pos.x - m.pos.x, p.pos.y - m.pos.y);
        if (distToPlayer <= 80) { // Trigger radius
          // Detonate
          m.active = false;
          this.state.mines.splice(i, 1);
          // Explosion radius 50
          if (distToPlayer <= 50 + p.radius) {
            p.hp -= 1;
            AudioManager.getInstance().playSFX("player_damage");
            this.state._currentWaveDamageTaken++;
          }
          AudioManager.getInstance().playSFX("mine_explosion");
          this.spawnRingExplosion(m.pos.x, m.pos.y);
          this.addScreenShake(4);
        }
      }
    }

    // Update Bullets
    for (const b of this.state.bullets) {
      if (!b.active) continue;
      
      if (b.type === "MISSILE") {
        if (b.lifetime !== undefined) {
          b.lifetime -= scaledDtMs;
          if (b.lifetime <= 0) {
            b.active = false;
            continue;
          }
        }
        
        if (b.angle !== undefined) {
          const tDx = p.pos.x - b.pos.x;
          const tDy = p.pos.y - b.pos.y;
          const targetAngle = Math.atan2(tDy, tDx);
          
          let diff = targetAngle - b.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          
          const maxTurn = 0.0012 * scaledDtMs;
          if (Math.abs(diff) <= maxTurn) {
            b.angle = targetAngle;
          } else {
            b.angle += Math.sign(diff) * maxTurn;
          }
          
          const speed = Math.hypot(b.vel.x, b.vel.y);
          b.vel.x = Math.cos(b.angle) * speed;
          b.vel.y = Math.sin(b.angle) * speed;
        }
      }
      
      b.pos.x += b.vel.x * scaledDtMs;
      b.pos.y += b.vel.y * scaledDtMs;

      // Check collision with bumpers
      for (const bumper of this.state.bumpers) {
        const dx = b.pos.x - bumper.pos.x;
        const dy = b.pos.y - bumper.pos.y;
        const dist = Math.hypot(dx, dy);
        const minDist = b.radius + bumper.radius;

        if (dist < minDist && dist > 0) {
          if (b.type === "MISSILE") {
            b.active = false;
            break;
          }
          
          // Resolve penetration
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          b.pos.x += nx * overlap;
          b.pos.y += ny * overlap;

          // Reflect velocity perfectly
          const dotProduct = b.vel.x * nx + b.vel.y * ny;
          if (dotProduct < 0) {
            b.vel.x -= 2 * dotProduct * nx;
            b.vel.y -= 2 * dotProduct * ny;
          }
          break; // Hit one bumper, continue
        }
      }
      if (!b.active) continue;

      // Despawn bounds check
      if (b.type === "MISSILE") {
        if (
          b.pos.x < 0 ||
          b.pos.x > this.state.bounds.width ||
          b.pos.y < 0 ||
          b.pos.y > this.state.bounds.height
        ) {
          b.active = false;
        }
      } else {
        const padding = 20;
        if (
          b.pos.x < -padding ||
          b.pos.x > this.state.bounds.width + padding ||
          b.pos.y < -padding ||
          b.pos.y > this.state.bounds.height + padding
        ) {
          b.active = false;
        }
      }
      
      if (!b.active) continue;

      // Bullet to player collision
      let dx = p.pos.x - b.pos.x;
      let dy = p.pos.y - b.pos.y;
      if (Math.hypot(dx, dy) < p.radius + b.radius) {
        b.active = false;
        p.hp -= 1;
        AudioManager.getInstance().playSFX("player_damage");
        this.state._currentWaveDamageTaken++;
      }
    }

    // Decrease screen shake
    if (this.state.screenShake > 0) {
      this.state.screenShake = Math.max(0, this.state.screenShake - 0.05 * scaledDtMs);
    }

    // Update Floating Texts
    for (let i = this.state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.state.floatingTexts[i];
      ft.pos.y -= 0.05 * scaledDtMs; // float upward
      ft.life += scaledDtMs;
      if (ft.life >= ft.maxLife) {
        this.state.floatingTexts.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const pt = this.state.particles[i];
      pt.pos.x += pt.vel.x * scaledDtMs;
      pt.pos.y += pt.vel.y * scaledDtMs;
      pt.life += scaledDtMs;
      if (pt.type === "RING") {
        pt.radius = (pt.radius || 0) + 0.15 * scaledDtMs;
      }
      if (pt.life >= pt.maxLife) {
        this.state.particles.splice(i, 1);
      }
    }

    this.state.enemiesLeft = this.state.turrets.filter(t => t.type !== "BOSS_TWIN_CORE_B").length;

    // Wave Progression
    if (this.state.waveState === "PLAYING" && this.state.enemiesLeft === 0) {
      this.state.waveState = "CLEAR_WAIT";
      this.state.waveTimer = 1500;

      // Perfect wave check
      if (this.state._currentWaveDamageTaken === 0) {
        this.state.perfectWaves++;
        this.state.score += 100 * this.state.wave;
        this.spawnFloatingText(this.state.bounds.width / 2, this.state.bounds.height / 2 - 50, "PERFECT WAVE BONUS", "#00E676", 1.5);
        AudioManager.getInstance().playSFX("perfect_wave");
      } else {
        AudioManager.getInstance().playSFX("wave_clear");
      }
    } else if (this.state.waveState === "CLEAR_WAIT") {
      this.state.waveTimer -= scaledDtMs;
      if (this.state.waveTimer <= 0) {
        this.state.wave++;
        this.state._currentWaveDamageTaken = 0;
        this.spawnWave(this.state.wave);
        this.state.waveState = "PLAYING";
      }
    }

    this.state.runTimeMs += dtMs;
    // Cleanup inactive bullets
    this.state.bullets = this.state.bullets.filter((b) => b.active);
  }
}
