import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  blur: number;
  rotation: number;
  scale: number;
}

export type ParticlePreset = 'autumn' | 'snow' | 'sakura' | 'summer';

const presetColors = {
  autumn: ['#D97652', '#C9A76B', '#8B4513', '#D4A574', '#CD853F'],
  snow: ['#FFFFFF', '#F0F8FF', '#E6F3FF'],
  sakura: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FFE4E1', '#FFA5B8'],
  summer: ['#FFD700', '#FFA500', '#FFDB58', '#FFE066', '#FFB90F'],
};

interface FallingLeavesProps {
  preset?: ParticlePreset;
}

export function FallingLeaves({ preset = 'autumn' }: FallingLeavesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 40 particles
    const generatedParticles: Particle[] = Array.from({ length: 40 }, (_, i) => {
      return {
        id: i,
        // All particles now start from a random horizontal point (0-100vw)
        x: Math.random() * 100, 
        size: 15 + Math.random() * 25,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 8,
        opacity: 0.3 + Math.random() * 0.5,
        color: presetColors[preset][Math.floor(Math.random() * presetColors[preset].length)],
        blur: Math.random() > 0.5 ? 0 : Math.random() * 2,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.7,
      };
    });
    setParticles(generatedParticles);
  }, [preset]);

  const getAnimationProps = (particle: Particle) => {
    const startX = particle.x;
    
    // Width of the side-to-side sway
    const swayAmount = 5 + Math.random() * 10; 

    if (preset === 'summer') {
      // FIREFLIES: Drift up and fade out at roughly half screen
      return {
        x: [
          `${startX}vw`,
          `${startX + swayAmount}vw`,
          `${startX - swayAmount}vw`,
          `${startX}vw`,
        ],
        // Start at bottom (100vh), disappear around mid-screen (45vh)
        y: ['100vh', '80vh', '65vh', '50vh', '40vh'],
        opacity: [0, 0.8, 1, 0.5, 0], // Natural fade in and fade out
      };
    } else {
      // AUTUMN, SAKURA, SNOW: Fall vertically with sway
      const rotationSpeed = preset === 'sakura' ? 720 : 360;
      
      return {
        x: [
          `${startX}vw`,
          `${startX + swayAmount}vw`,
          `${startX - swayAmount}vw`,
          `${startX}vw`,
        ],
        y: ['-10vh', '25vh', '50vh', '75vh', '110vh'],
        rotate: [
          particle.rotation,
          particle.rotation + rotationSpeed * 0.25,
          particle.rotation + rotationSpeed * 0.5,
          particle.rotation + rotationSpeed * 0.75,
          particle.rotation + rotationSpeed,
        ],
        // Keep consistent opacity for falling leaves
        opacity: particle.opacity
      };
    }
  };

  const renderParticle = (particle: Particle) => {
    if (preset === 'summer') {
      return (
        <div
          style={{
            width: particle.size * 0.4,
            height: particle.size * 0.4,
            borderRadius: '50%',
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}, 0 0 ${particle.size * 0.5}px ${particle.color}`,
            filter: 'blur(1px)',
          }}
        />
      );
    } else if (preset === 'snow') {
      return (
        <div
          style={{
            width: particle.size * 0.5,
            height: particle.size * 0.5,
            borderRadius: '50%',
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size / 2}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      );
    } else if (preset === 'sakura') {
      return (
        <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={particle.color}>
          <path d="M12 2c-1.5 3-4 5-7 5 0 4 3 7 7 9 4-2 7-5 7-9-3 0-5.5-2-7-5z" opacity="0.9" />
          <path d="M12 2c1.5 3 4 5 7 5-1 2-2 4-7 9-5-5-6-7-7-9 3 0 5.5-2 7-5z" opacity="0.7" />
        </svg>
      );
    } else {
      return (
        <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={particle.color}>
          <path d="M12 2l-1.5 4.5L7 5l2 4-4.5-.5L6 12l-4 2 4.5 1.5L5 19l4.5-2 1.5 4.5L12 17l1.5 4.5L15 17l4.5 2-1.5-4.5L22 16l-4-2 1.5-3.5L15 11l2-4-3.5 1.5z" />
        </svg>
      );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => {
        const animation = getAnimationProps(particle);
        const isSummer = preset === 'summer';
        
        return (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: isSummer ? '105vh' : '-15vh',
              rotate: particle.rotation,
              scale: particle.scale,
              opacity: isSummer ? 0 : particle.opacity,
            }}
            animate={animation}
            transition={{
              duration: isSummer ? particle.duration * 1.5 : particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: isSummer ? "easeOut" : "linear",
            }}
            style={{
              position: 'absolute',
              filter: particle.blur > 0 ? `blur(${particle.blur}px)` : 'none',
            }}
          >
            {renderParticle(particle)}
          </motion.div>
        );
      })}
    </div>
  );
}