import React, { useRef, useEffect } from "react";
import { GameEngine } from "../game/GameEngine";
import { Upgrades } from "../game/SaveSystem";

export interface GameStats {
  score: number;
  wave: number;
  turretsDestroyed: number;
  runTimeMs: number;
  enemiesLeft: number;
  isTimeFrozen: boolean;
  waveState: "PLAYING" | "CLEAR_WAIT";
  chronoEnergy: number;
  totalChronoUsed: number;
  totalChronoRecovered: number;
  currentComboMultiplier: number;
  boss?: { name: string; hp: number; maxHp: number };
}

interface GameCanvasProps {
  onHpChange?: (hp: number, maxHp: number) => void;
  onStatsChange?: (stats: GameStats) => void;
  onGameOver?: (stats: {
    score: number;
    wave: number;
    timeSurvived: number;
    turretsDestroyed: number;
    totalChronoUsed: number;
    totalChronoRecovered: number;
    highestSingleKill: number;
    totalBounceBonuses: number;
    perfectWaves: number;
    highestComboReached: number;
    highestComboMultiplier: number;
    totalComboBonusEarned: number;
  }) => void;
  upgrades?: Upgrades;
}

export default function GameCanvas({
  onHpChange,
  onStatsChange,
  onGameOver,
  upgrades
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    // Setup canvas dimension
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const engine = new GameEngine(width, height, upgrades);
    engineRef.current = engine;

    let lastTime = performance.now();
    let lastHp = engine.state.player.hp;
    let isGameOver = false;

    // Initial setup HP trigger
    if (onHpChange) onHpChange(lastHp, engine.state.player.maxHp);

    const loop = (time: number) => {
      if (isGameOver) return;

      const dt = time - lastTime;
      lastTime = time;

      engine.update(dt);

      const currentHp = engine.state.player.hp;
      if (currentHp !== lastHp) {
        lastHp = currentHp;
        if (onHpChange) onHpChange(currentHp, engine.state.player.maxHp);

        if (currentHp <= 0) {
          isGameOver = true;
          if (onGameOver) {
            onGameOver({
              score: engine.state.score,
              wave: engine.state.wave,
              turretsDestroyed: engine.state.turretsDestroyed,
              timeSurvived: Math.floor(engine.state.runTimeMs / 1000),
              totalChronoUsed: Math.floor(engine.state.totalChronoUsed),
              totalChronoRecovered: Math.floor(
                engine.state.totalChronoRecovered,
              ),
              highestSingleKill: engine.state.highestSingleKill,
              totalBounceBonuses: engine.state.totalBounceBonuses,
              perfectWaves: engine.state.perfectWaves,
              highestComboReached: engine.state.highestComboReached,
              highestComboMultiplier: engine.state.highestComboMultiplier,
              totalComboBonusEarned: engine.state.totalComboBonusEarned,
            });
          }
          return;
        }
      }

      if (onStatsChange) {
        let bossData = undefined;
        const boss = engine.state.turrets.find(t => t.hp !== undefined && t.maxHp !== undefined && t.type !== "BOSS_TWIN_CORE_B");
        if (boss) {
          let name = "BOSS";
          if (boss.type === "BOSS_JUGGERNAUT") name = "THE JUGGERNAUT";
          if (boss.type === "BOSS_TWIN_CORE_A") name = "THE TWIN CORES";
          if (boss.type === "BOSS_CHRONO_CORE") name = "THE CHRONO ENGINE";
          bossData = { name, hp: boss.hp!, maxHp: boss.maxHp!, hitFlashTimer: boss.hitFlashTimer || 0 };
        }
        
        onStatsChange({
          score: engine.state.score,
          wave: engine.state.wave,
          turretsDestroyed: engine.state.turretsDestroyed,
          runTimeMs: engine.state.runTimeMs,
          enemiesLeft: engine.state.enemiesLeft,
          isTimeFrozen: !engine.state.isDragging,
          waveState: engine.state.waveState,
          chronoEnergy: engine.state.chronoEnergy,
          totalChronoUsed: engine.state.totalChronoUsed,
          totalChronoRecovered: engine.state.totalChronoRecovered,
          currentComboMultiplier: engine.state.currentComboMultiplier,
          boss: bossData
        });
      }

      draw(canvasRef.current!, engine);

      if (!isGameOver) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      if (containerRef.current && canvasRef.current && engineRef.current) {
        const { width: newW, height: newH } =
          containerRef.current.getBoundingClientRect();
        canvasRef.current.width = newW;
        canvasRef.current.height = newH;
        engineRef.current.setBounds(newW, newH);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const draw = (canvas: HTMLCanvasElement, engine: GameEngine) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    const shake = engine.state.screenShake || 0;
    if (shake > 0) {
      const sx = (Math.random() - 0.5) * shake * 2;
      const sy = (Math.random() - 0.5) * shake * 2;
      ctx.translate(sx, sy);
    }

    const { player, isDragging, dragStart, dragCurrent, turrets, bullets } =
      engine.state;

    // Draw Bumpers
    for (const bumper of engine.state.bumpers) {
      ctx.save();
      ctx.translate(bumper.pos.x, bumper.pos.y);

      // Outer static ring
      ctx.beginPath();
      ctx.arc(0, 0, bumper.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#111111"; // dark background
      ctx.fill();
      ctx.strokeStyle = "#444444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner glowing core
      ctx.beginPath();
      ctx.arc(0, 0, bumper.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(41, 182, 246, 0.2)"; // Chrono Blue tint
      ctx.fill();
      ctx.strokeStyle = "#00B0FF"; // Bright blue
      ctx.lineWidth = 1.5;

      // subtle dash for mechanical feel
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Simple inner crosshair lines
      ctx.beginPath();
      ctx.moveTo(-bumper.radius * 0.7, 0);
      ctx.lineTo(bumper.radius * 0.7, 0);
      ctx.moveTo(0, -bumper.radius * 0.7);
      ctx.lineTo(0, bumper.radius * 0.7);
      ctx.strokeStyle = "rgba(0, 176, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.restore();
    }

    // Draw Turrets
    for (const t of turrets) {
      ctx.save();
      ctx.translate(t.pos.x, t.pos.y);
      
      let baseColor = "#FF1744";
      let darkColor = "#1A000A";
      let detailColor = "#FF4569";
      let innerColor = "#4D0017";
      
      if (t.type === "DRIFTER") {
        baseColor = "#FF9100";
        darkColor = "#1A0E00";
        detailColor = "#FFAB40";
        innerColor = "#4D2C00";
      } else if (t.type === "PULSAR") {
        baseColor = "#D500F9";
        darkColor = "#15001A";
        detailColor = "#E040FB";
        innerColor = "#3D004D";
      } else if (t.type === "TRACKER") {
        baseColor = "#00E676";
        darkColor = "#001A0D";
        detailColor = "#69F0AE";
        innerColor = "#004D27";
      } else if (t.type === "SHIELD_EMITTER") {
        baseColor = "#00B0FF";
        darkColor = "#001824";
        detailColor = "#40C4FF";
        innerColor = "#004B73";
      } else if (t.type === "BURST_SNIPER") {
        baseColor = "#FF3D00";
        darkColor = "#260900";
        detailColor = "#FF9E80";
        innerColor = "#731B00";
      } else if (t.type === "MINE_LAYER") {
        baseColor = "#FFC400";
        darkColor = "#261D00";
        detailColor = "#FFE57F";
        innerColor = "#735800";
      } else if (t.type === "BOSS_JUGGERNAUT") {
        baseColor = "#F50057";
        darkColor = "#24000D";
        detailColor = "#FF4081";
        innerColor = "#7A002B";
      } else if (t.type === "BOSS_TWIN_CORE_A") {
        baseColor = "#651FFF";
        darkColor = "#0F002B";
        detailColor = "#7C4DFF";
        innerColor = "#310080";
      } else if (t.type === "BOSS_TWIN_CORE_B") {
        baseColor = "#00E5FF";
        darkColor = "#002126";
        detailColor = "#18FFFF";
        innerColor = "#006473";
      } else if (t.type === "BOSS_CHRONO_CORE") {
        baseColor = "#C6FF00";
        darkColor = "#1D2600";
        detailColor = "#EEFF41";
        innerColor = "#638000";
      }

      ctx.rotate(t.angle);

      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 12;

      if (t.type === "PULSAR") {
        // Pulsar is a circle with spikes
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const outerX = Math.cos(angle) * t.radius;
          const outerY = Math.sin(angle) * t.radius;
          const innerAngle = angle + (Math.PI / 6);
          const innerX = Math.cos(innerAngle) * (t.radius * 0.5);
          const innerY = Math.sin(innerAngle) * (t.radius * 0.5);
          if (i === 0) ctx.moveTo(outerX, outerY);
          else ctx.lineTo(outerX, outerY);
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fillStyle = darkColor;
        ctx.fill();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, t.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = innerColor;
        ctx.fill();
        ctx.strokeStyle = detailColor;
        ctx.stroke();
      } else if (t.type === "SHIELD_EMITTER") {
        // Hexagon shape
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = Math.cos(angle) * t.radius;
          const py = Math.sin(angle) * t.radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = darkColor;
        ctx.fill();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(0, 0, t.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = innerColor;
        ctx.fill();
        ctx.strokeStyle = detailColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Aura pulse effect
        const pulse = Math.abs(Math.sin(Date.now() / 300));
        ctx.beginPath();
        ctx.arc(0, 0, t.radius * 0.5 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 176, 255, ${0.2 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // No gun barrel
      } else {
        // Base crystal diamond for others
        ctx.beginPath();
        ctx.moveTo(t.radius, 0); // Front tip
        ctx.lineTo(0, t.radius * 0.8); // Bottom/Right
        ctx.lineTo(-t.radius, 0); // Back tip
        ctx.lineTo(0, -t.radius * 0.8); // Top/Left
        ctx.closePath();
        ctx.fillStyle = darkColor; 
        ctx.fill();
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner polygon for detail
        ctx.beginPath();
        ctx.moveTo(t.radius * 0.6, 0);
        ctx.lineTo(0, t.radius * 0.4);
        ctx.lineTo(-t.radius * 0.6, 0);
        ctx.lineTo(0, -t.radius * 0.4);
        ctx.closePath();
        ctx.fillStyle = innerColor;
        ctx.fill();
        ctx.strokeStyle = detailColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (t.type !== "DRIFTER") {
          // Gun barrel
          ctx.beginPath();
          ctx.moveTo(t.radius * 0.5, -3);
          ctx.lineTo(t.radius * 1.3, -2);
          ctx.lineTo(t.radius * 1.3, 2);
          ctx.lineTo(t.radius * 0.5, 3);
          ctx.closePath();
          ctx.fillStyle = "#0a0a0a";
          ctx.fill();
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (t.type === "SPREAD") {
            // Left side barrel
            ctx.beginPath();
            ctx.moveTo(t.radius * 0.4, -t.radius * 0.3);
            ctx.lineTo(t.radius * 1.1, -t.radius * 0.4);
            ctx.lineTo(t.radius * 1.1, -t.radius * 0.2);
            ctx.lineTo(t.radius * 0.4, -t.radius * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right side barrel
            ctx.beginPath();
            ctx.moveTo(t.radius * 0.4, t.radius * 0.1);
            ctx.lineTo(t.radius * 1.1, t.radius * 0.2);
            ctx.lineTo(t.radius * 1.1, t.radius * 0.4);
            ctx.lineTo(t.radius * 0.4, t.radius * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (t.type === "TRACKER") {
            // Missile launcher indicator
            ctx.beginPath();
            ctx.arc(t.radius * 0.9, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = detailColor;
            ctx.fill();
          }
        }
      }

      if (t.isShielded || (t.type === "BOSS_TWIN_CORE_A" && !t.isShieldDisabled)) {
        ctx.beginPath();
        ctx.arc(0, 0, t.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 176, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, t.radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 176, 255, 0.15)";
        ctx.fill();
      }

      if (t.hitFlashTimer && t.hitFlashTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }

      ctx.restore();

      // Burst Sniper Laser (draw outside rotated context to align with TargetAngle)
      if (t.type === "BURST_SNIPER" && t.sniperState === "AIMING" && t.sniperTargetAngle !== undefined) {
        ctx.save();
        ctx.translate(t.pos.x, t.pos.y);
        ctx.rotate(t.sniperTargetAngle);
        ctx.beginPath();
        ctx.moveTo(t.radius, 0);
        ctx.lineTo(2000, 0);
        ctx.strokeStyle = "rgba(255, 61, 0, 0.4)";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw Mines
    for (const m of engine.state.mines) {
      if (!m.active) continue;
      ctx.save();
      ctx.translate(m.pos.x, m.pos.y);
      
      const pulse = m.armed ? Math.abs(Math.sin(Date.now() / 200)) : 0;
      
      ctx.beginPath();
      ctx.arc(0, 0, m.radius + (pulse * 4), 0, Math.PI * 2);
      ctx.fillStyle = m.armed ? `rgba(255, 61, 0, ${0.3 + pulse * 0.4})` : "rgba(255, 196, 0, 0.2)";
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-m.radius * 0.8, -m.radius * 0.8);
      ctx.lineTo(m.radius * 0.8, m.radius * 0.8);
      ctx.moveTo(m.radius * 0.8, -m.radius * 0.8);
      ctx.lineTo(-m.radius * 0.8, m.radius * 0.8);
      ctx.strokeStyle = m.armed ? "#FF3D00" : "#FFC400";
      ctx.lineWidth = 3;
      ctx.stroke();

      if (m.armed) {
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 61, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Draw Bullets
    for (const b of bullets) {
      if (!b.active) continue;
      ctx.save();
      ctx.translate(b.pos.x, b.pos.y);

      const bAngle = Math.atan2(b.vel.y, b.vel.x);
      ctx.rotate(bAngle);

      if ((b as any).type === "MISSILE") {
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = "rgba(0, 230, 118, 0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b.radius * 1.5, 0);
        ctx.lineTo(-b.radius, b.radius);
        ctx.lineTo(-b.radius * 0.5, 0);
        ctx.lineTo(-b.radius, -b.radius);
        ctx.closePath();
        ctx.fillStyle = "#69F0AE";
        ctx.shadowColor = "#00E676";
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        // Red trailing line
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = "rgba(255, 23, 68, 0.6)";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Glowing head
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4569";
        ctx.shadowColor = "#FF1744";
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.restore();
    }

    // Draw Particles
    for (const pt of engine.state.particles) {
      ctx.save();
      ctx.translate(pt.pos.x, pt.pos.y);
      ctx.globalAlpha = 1 - pt.life / pt.maxLife;

      if (pt.type === "RING") {
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, pt.radius || 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = pt.color;
        // diamond shape particle
        ctx.beginPath();
        ctx.moveTo(3, 0);
        ctx.lineTo(0, 3);
        ctx.lineTo(-3, 0);
        ctx.lineTo(0, -3);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
    
    // Draw Floating Texts
    for (const ft of engine.state.floatingTexts) {
      ctx.save();
      ctx.translate(ft.pos.x, ft.pos.y);
      ctx.globalAlpha = 1 - ft.life / ft.maxLife;
      ctx.fillStyle = ft.color;
      
      const popScale = 1 + Math.max(0, 1 - ft.life / 150) * 0.5;
      ctx.font = `bold ${14 * (ft.scale || 1) * popScale}px monospace`;
      
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Outline
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, 0, 0);
      ctx.fillText(ft.text, 0, 0);
      ctx.restore();
    }

    if (isDragging && dragStart && dragCurrent) {
      let dx = dragCurrent.x - dragStart.x;
      let dy = dragCurrent.y - dragStart.y;
      const dist = Math.hypot(dx, dy);

      if (dist > engine.maxDragDistance) {
        dx = (dx / dist) * engine.maxDragDistance;
        dy = (dy / dist) * engine.maxDragDistance;
      }

      // Draw slingshot line behind the sphere
      ctx.beginPath();
      ctx.moveTo(player.pos.x, player.pos.y);
      ctx.lineTo(player.pos.x + dx, player.pos.y + dy);
      ctx.strokeStyle = "#FF4569";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw the trajectory aiming line ahead of the sphere
      ctx.beginPath();
      ctx.moveTo(player.pos.x, player.pos.y);
      ctx.lineTo(player.pos.x - dx, player.pos.y - dy);
      ctx.strokeStyle = "#FF1744";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(-dy, -dx);
      ctx.save();
      ctx.translate(player.pos.x - dx, player.pos.y - dy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, 4);
      ctx.lineTo(-8, -4);
      ctx.fillStyle = "#FF1744";
      ctx.fill();
      ctx.restore();
    }

    // Chrome sphere drawing
    const grad = ctx.createRadialGradient(
      player.pos.x - player.radius * 0.3,
      player.pos.y - player.radius * 0.3,
      player.radius * 0.1,
      player.pos.x,
      player.pos.y,
      player.radius,
    );
    grad.addColorStop(0, "#FFFFFF");
    grad.addColorStop(0.35, "#ECECEC");
    grad.addColorStop(0.68, "#8A8985");
    grad.addColorStop(1, "#1A1A1A");

    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Pulse/Stroke
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,23,68,0.4)";
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.arc(
      player.pos.x - player.radius * 0.3,
      player.pos.y - player.radius * 0.3,
      player.radius * 0.2,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();

    ctx.restore(); // Screen shake
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!engineRef.current) return;
    const { x, y } = getPointerPos(e);
    engineRef.current.handlePointerDown(x, y);
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!engineRef.current) return;
    const { x, y } = getPointerPos(e);
    engineRef.current.handlePointerMove(x, y);
  };

  const onPointerUp = () => {
    if (!engineRef.current) return;
    engineRef.current.handlePointerUp();
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-8 inset-y-8 rounded border border-chrono-panel/40 overflow-hidden select-none z-10"
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair relative z-20"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onTouchCancel={onPointerUp}
      />
    </div>
  );
}
