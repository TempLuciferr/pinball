import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Volume2,
  ShieldAlert,
  Award,
  Compass,
  Timer,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  AlertCircle,
  ShoppingBag,
  EyeOff,
  User,
  Swords,
} from "lucide-react";
import BackgroundEffects from "./components/BackgroundEffects";
import TopStatusBar from "./components/TopStatusBar";
import LogoSection from "./components/LogoSection";
import MenuButtonList from "./components/MenuButtons";
import ChronoSphere from "./components/ChronoSphere";
import ParticleBurst from "./components/ParticleBurst";
import ProtocolSelectPage from "./components/ProtocolSelectPage";
import GameplayHUD from "./components/GameplayHUD";
import { PauseMenuProvider } from "./components/PauseMenuContext";
import UpgradeShopPage from "./components/UpgradeShopPage";
import GameOverPage from "./components/GameOverPage";
import StatisticsPage from "./components/StatisticsPage";
import { SaveSystem, SaveData } from "./game/SaveSystem";
import { AudioManager } from "./game/AudioManager";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "MENU" | "PROTOCOL_SELECT" | "GAMEPLAY" | "UPGRADE_SHOP" | "GAME_OVER" | "STATISTICS"
  >("MENU");
  const [activeMenuOverlay, setActiveMenuOverlay] = useState<string | null>(
    null,
  );
  const [lastRunStats, setLastRunStats] = useState({
    score: 0,
    wave: 1,
    timeSurvived: 0,
    turretsDestroyed: 0,
    totalChronoUsed: 0,
    totalChronoRecovered: 0,
    highestSingleKill: 0,
    totalBounceBonuses: 0,
    perfectWaves: 0,
    highestComboReached: 0,
    highestComboMultiplier: 1.0,
    totalComboBonusEarned: 0,
    earnedCores: 0,
  });

  // Save state
  const [saveData, setSaveData] = useState<SaveData>(() => SaveSystem.load());

  useEffect(() => {
    // Initialize audio and load settings
    AudioManager.getInstance().init();
    if (saveData.audioSettings) {
      AudioManager.getInstance().loadSettings(saveData.audioSettings);
    }
  }, []);

  useEffect(() => {
    SaveSystem.save(saveData);
  }, [saveData]);

  // Set music state
  useEffect(() => {
    if (currentScreen === "MENU" || currentScreen === "PROTOCOL_SELECT" || currentScreen === "UPGRADE_SHOP" || currentScreen === "STATISTICS") {
      AudioManager.getInstance().playMusic("MENU");
    } else if (currentScreen === "GAMEPLAY") {
      AudioManager.getInstance().playMusic("GAMEPLAY");
    } else {
      AudioManager.getInstance().stopMusic();
    }
  }, [currentScreen]);

  const openOverlay = (menuName: string) => {
    AudioManager.getInstance().init(); // ensure initialized
    AudioManager.getInstance().playSFX("menu_click");
    // If user clicked PLAY button, navigate natively to Protocol selector screen instead of simple modal!
    if (menuName === "PLAY") {
      setCurrentScreen("PROTOCOL_SELECT");
    } else if (menuName === "STATISTICS") {
      setCurrentScreen("STATISTICS");
    } else {
      setActiveMenuOverlay(menuName);
    }
  };

  const closeOverlay = () => {
    AudioManager.getInstance().playSFX("menu_back");
    setActiveMenuOverlay(null);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden flex flex-col justify-between p-4 md:p-6 lg:p-8 select-none bg-chrono-bg font-sans text-chrono-black">
      {/* 1. White Lab Responsive Environmental Frame */}
      <BackgroundEffects />

      {/* 2. Top Status Bar HUD HUD Elements (Health, Timer, Currency) */}
      {currentScreen !== "GAMEPLAY" &&
        currentScreen !== "UPGRADE_SHOP" &&
        currentScreen !== "STATISTICS" &&
        currentScreen !== "GAME_OVER" && <TopStatusBar cores={saveData.cores} />}

      {/* 3. Render page conditionally with animation */}
      <AnimatePresence mode="wait">
        {currentScreen === "MENU" ? (
          <motion.main
            key="main-menu"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 w-full max-w-[1440px] mx-auto px-4 lg:px-8 my-4"
          >
            {/* Left Side: Game Branding and Cascade Navigation */}
            <div className="lg:col-span-5 flex flex-col justify-center items-start lg:h-full gap-8">
              <LogoSection />

              {/* Main button lists */}
              <MenuButtonList onSelectOption={openOverlay} />
            </div>

            {/* Right Side: Centered Hero Cluster (Explosion Burst behind, floating Chrome Sphere in front) */}
            <div className="absolute inset-0 -z-10 opacity-40 md:opacity-100 md:relative md:z-auto lg:col-span-7 flex items-center justify-center w-full h-[320px] md:h-[450px] lg:h-full overflow-visible pointer-events-none md:pointer-events-auto">
              {/* Particle Explosion from Section 5 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ParticleBurst />
              </div>

              {/* Chrome Pinball Sphere from Section 4 */}
              <ChronoSphere />
            </div>
          </motion.main>
        ) : currentScreen === "PROTOCOL_SELECT" ? (
          <motion.div
            key="protocol"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto my-4"
          >
            <ProtocolSelectPage
              onBackToMenu={() => setCurrentScreen("MENU")}
              onOpenShop={() => openOverlay("SHOP")}
              onStartSimulation={() => setCurrentScreen("GAMEPLAY")}
            />
          </motion.div>
        ) : currentScreen === "GAMEPLAY" ? (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto my-4"
          >
            <PauseMenuProvider>
              <GameplayHUD
                saveData={saveData}
                onExit={() => setCurrentScreen("PROTOCOL_SELECT")}
                onOpenShop={() => setCurrentScreen("UPGRADE_SHOP")}
                onGameOver={(stats) => {
                  const earnedCores = Math.floor(stats.score / 500) 
                                    + (stats.wave * 5)
                                    + (stats.perfectWaves * 20)
                                    + (stats.turretsDestroyed * 1);
                                    
                  setLastRunStats({ ...stats, earnedCores });
                  
                  setSaveData(prev => {
                    const earnedXP = Math.floor(stats.score / 100);
                    
                    let next = {
                      ...prev,
                      cores: prev.cores + earnedCores,
                      lifetimeCores: prev.lifetimeCores + earnedCores,
                      stats: {
                        ...prev.stats,
                        totalRuns: (prev.stats?.totalRuns || 0) + 1,
                        totalPlayTimeMs: (prev.stats?.totalPlayTimeMs || 0) + (stats.timeSurvived * 1000),
                        totalTurretsDestroyed: (prev.stats?.totalTurretsDestroyed || 0) + stats.turretsDestroyed,
                        totalPerfectWaves: (prev.stats?.totalPerfectWaves || 0) + stats.perfectWaves,
                        highestScore: Math.max(prev.stats?.highestScore || 0, stats.score),
                        highestWave: Math.max(prev.stats?.highestWave || 0, stats.wave),
                        highestComboMultiplier: Math.max(prev.stats?.highestComboMultiplier || 1.0, stats.highestComboMultiplier),
                        highestComboKills: Math.max(prev.stats?.highestComboKills || 0, stats.highestComboReached),
                        lifetimeChronoEnergyUsed: (prev.stats?.lifetimeChronoEnergyUsed || 0) + stats.totalChronoUsed,
                        lifetimeChronoEnergyRecovered: (prev.stats?.lifetimeChronoEnergyRecovered || 0) + stats.totalChronoRecovered,
                      }
                    };

                    next = SaveSystem.addXP(next, earnedXP);

                    // Achievement Checking
                    let unlockedAny = false;
                    if (!next.achievements?.firstBlood && (next.stats?.totalTurretsDestroyed || 0) > 0) {
                      next.achievements = { ...next.achievements, firstBlood: true } as any;
                      unlockedAny = true;
                    }
                    if (!next.achievements?.waveRider && (next.stats?.highestWave || 0) >= 10) {
                      next.achievements = { ...next.achievements, waveRider: true } as any;
                      unlockedAny = true;
                    }
                    if (!next.achievements?.chronoMaster && (next.stats?.highestComboMultiplier || 1.0) >= 3.0) {
                      next.achievements = { ...next.achievements, chronoMaster: true } as any;
                      unlockedAny = true;
                    }
                    if (!next.achievements?.perfectExecution && stats.perfectWaves >= 5) {
                      next.achievements = { ...next.achievements, perfectExecution: true } as any;
                      unlockedAny = true;
                    }
                    if (!next.achievements?.coreCollector && next.lifetimeCores >= 5000) {
                      next.achievements = { ...next.achievements, coreCollector: true } as any;
                      unlockedAny = true;
                    }
                    if (!next.achievements?.pinballGod && (next.stats?.highestWave || 0) >= 25) {
                      next.achievements = { ...next.achievements, pinballGod: true } as any;
                      unlockedAny = true;
                    }

                    if (unlockedAny) {
                      setTimeout(() => AudioManager.getInstance().playSFX("achievement"), 1500);
                    }
                    return next;
                  });

                  AudioManager.getInstance().playSFX("game_over");
                  setCurrentScreen("GAME_OVER");
                }}
              />
            </PauseMenuProvider>
          </motion.div>
        ) : currentScreen === "UPGRADE_SHOP" ? (
          <motion.div
            key="upgrade-shop"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto my-4"
          >
            <UpgradeShopPage 
              onContinue={() => setCurrentScreen("GAMEPLAY")} 
              saveData={saveData}
              setSaveData={setSaveData}
            />
          </motion.div>
        ) : currentScreen === "STATISTICS" ? (
          <motion.div
            key="statistics"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto my-4"
          >
            <StatisticsPage 
              onBack={() => setCurrentScreen("MENU")} 
              saveData={saveData} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto my-4"
          >
            <GameOverPage
              score={lastRunStats.score}
              wavesCleared={`${(lastRunStats.wave || 1).toString().padStart(2, "0")} / 12`}
              enemiesDestroyed={lastRunStats.turretsDestroyed}
              timeFrozen={
                lastRunStats?.timeSurvived
                  ? new Date(lastRunStats.timeSurvived * 1000).toISOString().substr(11, 8)
                  : "00:00:00"
              }
              totalChronoUsed={lastRunStats.totalChronoUsed}
              totalChronoRecovered={lastRunStats.totalChronoRecovered}
              highestSingleKill={lastRunStats.highestSingleKill}
              totalBounceBonuses={lastRunStats.totalBounceBonuses}
              perfectWaves={lastRunStats.perfectWaves}
              highestComboReached={lastRunStats.highestComboReached}
              highestComboMultiplier={lastRunStats.highestComboMultiplier}
              totalComboBonusEarned={lastRunStats.totalComboBonusEarned}
              creditsReward={lastRunStats.earnedCores}
              onRestart={() => setCurrentScreen("GAMEPLAY")}
              onMainMenu={() => setCurrentScreen("MENU")}
              onOpenShop={() => setCurrentScreen("UPGRADE_SHOP")}
              onOpenLeaderboard={() =>
                alert("LEADERBOARD ACCESSED\nSyncing latest run times.")
              }
              onReviveSuccess={() => setCurrentScreen("GAMEPLAY")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Footer Displays: Best Time - Image 2 Section 2.3 */}
      {currentScreen === "MENU" && (
        <div className="relative z-10 w-full flex flex-col items-center justify-center font-mono select-none py-1 gap-1">
          <span className="text-[10px] md:text-xs font-bold text-chrono-dark tracking-[0.25em] uppercase opacity-75">
            BEST TIME
          </span>
          <div className="flex items-center gap-2 text-chrono-red text-base md:text-lg font-hud font-extrabold tracking-widest filter drop-shadow-[0_0_4px_rgba(255,23,68,0.25)] bg-[#111111] px-4 py-1 rounded">
            <Timer className="w-4 h-4" />
            <span>01:23:45</span>
          </div>
        </div>
      )}

      {/* 5. Modals / Interactive Overlays (Highly-polished layouts matching Style guidelines only) */}
      <AnimatePresence>
        {activeMenuOverlay && (
          <div className="fixed inset-0 bg-chrono-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Modal Box */}
            <motion.div
              layoutId="overlay-panel"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-[#FAF9F6] border-2 border-chrono-panel shadow-2xl overflow-hidden rounded"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              }}
            >
              {/* Corner decal highlights */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-chrono-red" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-chrono-red" />

              {/* Title Header bar */}
              <div className="bg-chrono-black text-white px-5 py-4 flex items-center justify-between border-b border-chrono-dark">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-chrono-red animate-pulse" />
                  <h2 className="font-hud text-xs md:text-sm tracking-[0.2em] font-black uppercase">
                    {activeMenuOverlay} MODULE
                  </h2>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={closeOverlay}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 bg-chrono-dark/30 hover:bg-chrono-red rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Modal Contents based on selected Button */}
              <div className="p-6 md:p-8 font-display">
                {/* CHALLENGES MODAL */}
                {activeMenuOverlay === "CHALLENGES" && (
                  <div className="space-y-4">
                    <p className="text-xs text-chrono-dark mb-4 leading-relaxed font-sans">
                      Complete active Sector challenges to earn multiplier
                      bonuses and buy custom materials for the cyber sphere
                      inside the Shop.
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          title: "CHRONO CLUTCH",
                          desc: "Trigger 5 custom bullet strikes within 10 seconds of simulation start.",
                          reward: "+250 CR",
                        },
                        {
                          title: "CHROME SURVIVOR",
                          desc: "Never lose health sectors for 120 seconds of continuous runs.",
                          reward: "+400 CR",
                        },
                        {
                          title: "TIMELESS COMBO x5",
                          desc: "Rack up five successive angle bounces using time dilution.",
                          reward: "+550 CR",
                        },
                        {
                          title: "PERFECT REFLEX",
                          desc: "Hit the launch trigger within 0.15s of core charge completion.",
                          reward: "+100 CR",
                        },
                      ].map((ch, i) => (
                        <div
                          key={i}
                          className="bg-white border border-[#E5E4E0] p-3.5 rounded flex justify-between items-center group hover:border-chrono-red/30 transition-all"
                        >
                          <div className="space-y-0.5 pr-4">
                            <h4 className="text-xs font-hud font-bold tracking-wider text-chrono-dark group-hover:text-chrono-red transition-colors uppercase">
                              {ch.title}
                            </h4>
                            <p className="text-[11px] text-chrono-dark/70 font-sans leading-snug">
                              {ch.desc}
                            </p>
                          </div>
                          <span className="text-[10px] whitespace-nowrap font-mono font-bold bg-[#E5E5E2] px-2 py-1 text-chrono-black rounded-sm border border-chrono-panel group-hover:bg-chrono-red group-hover:text-white group-hover:border-transparent transition-colors">
                            {ch.reward}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SHOP MODAL */}
                {activeMenuOverlay === "SHOP" && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center bg-[#E5E5E2]/40 p-3 rounded border border-chrono-panel">
                      <span className="text-xs text-chrono-dark font-mono font-bold">
                        CURRENT CREDITS:
                      </span>
                      <span className="text-sm font-hud font-black text-chrono-red">
                        1,250 <span className="text-chrono-dark">+</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          name: "GOLD FLAKE CORONA",
                          desc: "Premium textured finish",
                          price: "800 CR",
                          owned: false,
                        },
                        {
                          name: "OBSIDIAN CORE",
                          desc: "Dark basalt mirror coating",
                          price: "Owned",
                          owned: true,
                        },
                        {
                          name: "CHRONO SPEED SENSOR",
                          desc: "+12% faster gauge reload",
                          price: "500 CR",
                          owned: false,
                        },
                        {
                          name: "VINTAGE GLITCH TRAIL",
                          desc: "CRT pixel trace animation",
                          price: "1,200 CR",
                          owned: false,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-chrono-panel p-4 rounded flex flex-col justify-between hover:border-chrono-red/30 transition-all space-y-3"
                        >
                          <div className="space-y-1">
                            <h4 className="text-[11px] font-hud font-bold tracking-wider text-chrono-black uppercase max-w-[150px] leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-chrono-dark/70 font-sans leading-tight">
                              {item.desc}
                            </p>
                          </div>

                          <button
                            disabled={item.owned}
                            onClick={() => {
                              AudioManager.getInstance().playSFX("menu_click");
                              alert(
                                `Equipping and purchasing ${item.name}! This is a menu visual showcase.`,
                              );
                            }}
                            className={`w-full py-1.5 text-[10px] font-hud font-extrabold tracking-widest rounded transition-colors cursor-pointer text-center ${
                              item.owned
                                ? "bg-chrono-panel/50 text-chrono-dark cursor-not-allowed"
                                : "bg-chrono-red text-white hover:bg-chrono-accent"
                            }`}
                          >
                            {item.owned ? "EQUIPPED" : item.price}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SETTINGS MODAL */}
                {activeMenuOverlay === "SETTINGS" && (
                  <div className="space-y-5">
                    {/* Audio Custom Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-chrono-dark">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5" /> MASTER AUDIO
                        </span>
                        <span>{Math.round(AudioManager.getInstance().masterVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(AudioManager.getInstance().masterVolume * 100)}
                        onChange={(e) => {
                          const val = Number(e.target.value) / 100;
                          AudioManager.getInstance().masterVolume = val;
                          AudioManager.getInstance().updateVolumes();
                          setSaveData(prev => ({ ...prev, audioSettings: AudioManager.getInstance().getSettings() }));
                          AudioManager.getInstance().playSFX("menu_hover");
                        }}
                        className="w-full h-1 bg-chrono-panel rounded-lg appearance-none cursor-pointer accent-chrono-red"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-chrono-dark">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5" /> MUSIC
                        </span>
                        <span>{Math.round(AudioManager.getInstance().musicVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(AudioManager.getInstance().musicVolume * 100)}
                        onChange={(e) => {
                          const val = Number(e.target.value) / 100;
                          AudioManager.getInstance().musicVolume = val;
                          AudioManager.getInstance().updateVolumes();
                          setSaveData(prev => ({ ...prev, audioSettings: AudioManager.getInstance().getSettings() }));
                          AudioManager.getInstance().playSFX("menu_hover");
                        }}
                        className="w-full h-1 bg-chrono-panel rounded-lg appearance-none cursor-pointer accent-chrono-red"
                      />
                    </div>

                    {/* SFX slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-chrono-dark">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" /> DIAL FX POWER
                        </span>
                        <span>{Math.round(AudioManager.getInstance().sfxVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(AudioManager.getInstance().sfxVolume * 100)}
                        onChange={(e) => {
                          const val = Number(e.target.value) / 100;
                          AudioManager.getInstance().sfxVolume = val;
                          AudioManager.getInstance().updateVolumes();
                          setSaveData(prev => ({ ...prev, audioSettings: AudioManager.getInstance().getSettings() }));
                          AudioManager.getInstance().playSFX("menu_hover");
                        }}
                        className="w-full h-1 bg-chrono-panel rounded-lg appearance-none cursor-pointer accent-chrono-red"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-sans mt-2">
                      <span className="font-bold text-chrono-dark">MUTE ALL AUDIO</span>
                      <button
                        onClick={() => {
                          AudioManager.getInstance().muted = !AudioManager.getInstance().muted;
                          AudioManager.getInstance().updateVolumes();
                          setSaveData(prev => ({ ...prev, audioSettings: AudioManager.getInstance().getSettings() }));
                          AudioManager.getInstance().playSFX("menu_click");
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                          AudioManager.getInstance().muted ? "bg-chrono-red" : "bg-chrono-panel"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            AudioManager.getInstance().muted ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <hr className="border-chrono-panel/40 my-2" />

                    {/* Graphical Toggles */}
                    <div className="space-y-3 font-sans">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-chrono-dark">
                          CHROME REFLECTION BLUR
                        </span>
                        <button
                          onClick={() => {
                            triggerMenuClickSound(600, "sine", 0.06);
                            setMotionBlur(!motionBlur);
                          }}
                          className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                            motionBlur ? "bg-chrono-red" : "bg-chrono-panel"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              motionBlur ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-chrono-dark">
                          PARTICLE VELOCITY QUALITY
                        </span>
                        <select
                          value={particlesCount}
                          onChange={(e) => {
                            setParticlesCount(e.target.value);
                            triggerMenuClickSound(600, "sine", 0.06);
                          }}
                          className="bg-white border border-chrono-panel px-3 py-1 text-xs rounded font-mono font-bold text-chrono-black outline-none focus:border-chrono-red cursor-pointer"
                        >
                          <option value="LOW">LOW (OPTIMIZED)</option>
                          <option value="MEDIUM">STANDARD</option>
                          <option value="HIGH">BURST EXTREME</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setVolume(80);
                          setSfx(90);
                          setMotionBlur(true);
                          setParticlesCount("HIGH");
                          triggerMenuClickSound(330, "triangle", 0.2);
                        }}
                        className="w-full py-2.5 bg-[#E5E5E2] hover:bg-chrono-dark hover:text-white transition-colors text-chrono-black font-hud font-bold text-xs tracking-widest rounded cursor-pointer"
                      >
                        RESET CALIBRATION
                      </button>
                    </div>
                  </div>
                )}

                {/* LEADERBOARDS MODAL */}
                {activeMenuOverlay === "LEADERBOARDS" && (
                  <div className="space-y-4">
                    <p className="text-xs text-chrono-dark mb-2 leading-relaxed">
                      Global timeline rankings displaying absolute best session
                      run times for Sector 07.
                    </p>

                    <div className="border border-chrono-panel rounded overflow-hidden">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#E5E5E2] text-chrono-dark uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="py-2.5 px-4">RANK</th>
                            <th className="py-2.5 px-4">SIMULATOR ID</th>
                            <th className="py-2.5 px-4 text-right">
                              BEST RUN TIME
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-chrono-panel/50 bg-white">
                          {[
                            {
                              rank: "01",
                              name: "CHRONO_GOD",
                              time: "00:54:12",
                              icon: "💎",
                              isSelf: false,
                            },
                            {
                              rank: "02",
                              name: "MIRROR_RUNNER",
                              time: "01:03:09",
                              icon: "🔥",
                              isSelf: false,
                            },
                            {
                              rank: "03",
                              name: "PIN_STRIKER_45",
                              time: "01:12:55",
                              icon: "⚡",
                              isSelf: false,
                            },
                            {
                              rank: "04",
                              name: "YOU (PLAYER_07)",
                              time: "01:23:45",
                              icon: "🎯",
                              isSelf: true,
                            },
                            {
                              rank: "05",
                              name: "VECTOR_CORES",
                              time: "01:31:02",
                              icon: "🌐",
                              isSelf: false,
                            },
                          ].map((player, idx) => (
                            <tr
                              key={idx}
                              className={`${player.isSelf ? "bg-chrono-red/10 text-chrono-red font-bold" : "text-chrono-dark"}`}
                            >
                              <td className="py-3 px-4 flex items-center gap-1">
                                <span>{player.rank}</span>
                                <span className="text-[10px]">
                                  {player.icon}
                                </span>
                              </td>
                              <td className="py-3 px-4 uppercase">
                                {player.name}
                              </td>
                              <td className="py-3 px-4 text-right font-hud font-bold">
                                {player.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
