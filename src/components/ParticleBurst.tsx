import React from "react";
import { motion } from "motion/react";

export default function ParticleBurst() {
  // Exact angles and structural metadata for the vector lines in Image 1 / Image 2 Section 8.
  // Each line radiates from (50%, 50%) of its container outward at specific angles, lengths, and custom attachments.
  const burstLines = [
    // Top Left sector
    { angle: 115, len: 190, hasArow: true, hasNode: true, nodePos: 0.4 },
    { angle: 135, len: 260, hasArow: true, hasNode: false, nodePos: 0 },
    { angle: 155, len: 140, hasArow: false, hasNode: true, nodePos: 0.7 },
    { angle: 170, len: 210, hasArow: true, hasNode: true, nodePos: 0.3 },

    // Bottom Left sector
    { angle: 195, len: 280, hasArow: true, hasNode: false, nodePos: 0 },
    { angle: 215, len: 170, hasArow: false, hasNode: true, nodePos: 0.6 },
    { angle: 235, len: 240, hasArow: true, hasNode: true, nodePos: 0.5 },
    { angle: 250, len: 130, hasArow: false, hasNode: false, nodePos: 0 },

    // Bottom Right sector
    { angle: 285, len: 150, hasArow: false, hasNode: true, nodePos: 0.4 },
    { angle: 305, len: 290, hasArow: true, hasNode: true, nodePos: 0.7 },
    { angle: 325, len: 220, hasArow: true, hasNode: false, nodePos: 0 },
    { angle: 345, len: 160, hasArow: false, hasNode: true, nodePos: 0.5 },

    // Top Right sector
    { angle: 15, len: 250, hasArow: true, hasNode: false, nodePos: 0 },
    { angle: 35, len: 180, hasArow: false, hasNode: true, nodePos: 0.6 },
    { angle: 55, len: 270, hasArow: true, hasNode: true, nodePos: 0.3 },
    { angle: 75, len: 130, hasArow: false, hasNode: false, nodePos: 0 },
    { angle: 95, len: 210, hasArow: true, hasNode: true, nodePos: 0.55 },
  ];

  // Faceted physical shards near the center core (Section 6)
  const shards = [
    { x: -70, y: -80, scale: 1.2, points: "0,5 5,0 8,10 2,12" }, // Wedge
    { x: -110, y: -40, scale: 0.9, points: "2,0 8,2 10,8 4,10" }, // Rhombus
    { x: -50, y: 70, scale: 1.1, points: "5,0 10,6 7,12 1,8" },
    { x: -90, y: 90, scale: 0.8, points: "0,4 6,0 12,5 4,11" },
    { x: 90, y: -90, scale: 1.3, points: "4,0 12,3 9,11 1,8" },
    { x: 130, y: -30, scale: 1.0, points: "0,6 6,0 11,4 5,11" },
    { x: 70, y: 60, scale: 1.4, points: "3,0 10,2 12,8 5,12" },
    { x: 110, y: 80, scale: 0.8, points: "0,5 7,0 10,9 3,11" },
    { x: -140, y: 15, scale: 1.0, points: "0,4 8,0 11,8 3,10" },
    { x: 140, y: 20, scale: 1.1, points: "2,0 9,1 12,7 4,9" },
    { x: -20, y: -130, scale: 1.2, points: "1,0 8,2 10,8 3,9" },
    { x: 40, y: -140, scale: 0.9, points: "0,6 6,0 12,5 5,11" },
    { x: -30, y: 130, scale: 1.3, points: "4,0 11,1 9,9 2,12" },
    { x: 35, y: 140, scale: 0.7, points: "0,4 6,0 10,8 3,10" },
  ];

  // Square coordinates nodes (Section 7)
  const squares = [
    { x: -50, y: -40, delay: 0 },
    { x: -65, y: 10, delay: 0.2 },
    { x: -35, y: 55, delay: 0.4 },
    { x: 45, y: -50, delay: 0.1 },
    { x: 65, y: -15, delay: 0.3 },
    { x: 55, y: 45, delay: 0.5 },
  ];

  return (
    <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[840px] lg:h-[840px] pointer-events-none z-0">
      <svg 
        viewBox="0 0 800 800" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Arrowhead marker for clean vector lines */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#FF1744" />
          </marker>

          {/* Central radial explosion glow mask */}
          <radialGradient id="explode-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF1744" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#FF4569" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#F6F5F2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient radial red burst glow */}
        <circle cx="400" cy="400" r="320" fill="url(#explode-glow)" />

        {/* Tactical target rings centered around burst */}
        <circle cx="400" cy="400" r="100" stroke="#FF1744" strokeWidth="0.8" strokeDasharray="2, 6" fill="none" opacity="0.25" />
        <circle cx="400" cy="400" r="160" stroke="#FF1744" strokeWidth="0.8" strokeDasharray="4, 12" fill="none" opacity="0.15" />
        <circle cx="400" cy="400" r="220" stroke="#FF1744" strokeWidth="0.8" strokeDasharray="1, 8" fill="none" opacity="0.2" />

        {/* Vector Burst Lines (Image 2 Section 8) */}
        {burstLines.map((line, idx) => {
          const rad = (line.angle * Math.PI) / 180;
          const startR = 45; // Start just outside sphere radius
          const endR = line.len;

          const x1 = 400 + Math.cos(rad) * startR;
          const y1 = 400 + Math.sin(rad) * startR;
          const x2 = 400 + Math.cos(rad) * endR;
          const y2 = 400 + Math.sin(rad) * endR;

          // Compute square node position if applicable
          const nodeR = startR + (endR - startR) * line.nodePos;
          const nx = 400 + Math.cos(rad) * nodeR;
          const ny = 400 + Math.sin(rad) * nodeR;

          return (
            <g key={idx} className="opacity-80">
              {/* Radiating Line */}
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: idx * 0.03, ease: "easeOut" }}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FF1744"
                strokeWidth="1.2"
                markerEnd={line.hasArow ? "url(#arrow)" : undefined}
              />

              {/* Square node nested directly on vector coordinate */}
              {line.hasNode && (
                <motion.rect
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.02 }}
                  x={nx - 3}
                  y={ny - 3}
                  width="6"
                  height="6"
                  fill="#FF1744"
                  transform={`rotate(${(line.angle + 45)}, ${nx}, ${ny})`}
                />
              )}
            </g>
          );
        })}

        {/* Render Shards floating as static vectors with slight live kinetic vibration */}
        {shards.map((sh, idx) => {
          const cx = 400 + sh.x;
          const cy = 400 + sh.y;

          return (
            <motion.polygon
              key={`shard-${idx}`}
              points={sh.points}
              fill="#FF1744"
              className="opacity-90"
              initial={{ scale: 0, x: cx, y: cy }}
              animate={{ 
                scale: sh.scale,
                // Gentle drift simulating time-lock vibration
                x: [cx, cx + (Math.sin(idx) * 4), cx],
                y: [cy, cy + (Math.cos(idx) * 4), cy],
                rotate: [0, idx % 2 === 0 ? 5 : -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5 + (idx % 3),
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Square Nodes scattered closely near sphere coordinate bounds */}
        {squares.map((sq, idx) => {
          const cx = 400 + sq.x;
          const cy = 400 + sq.y;

          return (
            <motion.rect
              key={`sq-${idx}`}
              x={cx - 3.5}
              y={cy - 3.5}
              width="7"
              height="7"
              fill="#FF1744"
              className="opacity-90"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.15, 1],
                // Anti-phase micro vibrations
                x: [cx - 3.5, cx - 3.5 + (Math.cos(idx) * 3), cx - 3.5],
                y: [cy - 3.5, cy - 3.5 + (Math.sin(idx) * 3), cy - 3.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + sq.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
