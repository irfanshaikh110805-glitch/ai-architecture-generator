import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

// Map each section to its animation video
const SECTION_VIDEOS = {
  hero:          '/Chibi_AI_Architect/Hero Wave + Features Pointing Animations/001_A_young_wizard_with_a_blue_robe_and_a_matching_R3-P4pqt.mp4',
  features:      '/Chibi_AI_Architect/Hero Wave + Features Pointing Animations/002_A_child-like_figure_with_glowing_blue_eyes_yNn8bXkA.mp4',
  'how-it-works':'/Chibi_AI_Architect/How It Works Thinking + Testimonials Thumbs Up/001_A_young_animated_wizard_with_glowing_blue_eyes_MHpNInLp.mp4',
  testimonials:  '/Chibi_AI_Architect/How It Works Thinking + Testimonials Thumbs Up/002_A_stylized_child_in_a_wizard_hat_and_robe_holds_a_qw0D5JQP.mp4',
  cta:           '/Chibi_AI_Architect/CTA Jump + Click Spin Animations/001_A_stylized_digital_character_wearing_a_wizard_hat_tch4vopZ.mp4',
};

// Fallback video for clicks (spin animation)
const CLICK_SPIN_VIDEO = '/Chibi_AI_Architect/CTA Jump + Click Spin Animations/002_A_child_wearing_a_wizard_hat_and_robe_adorned_OF1tCAYh.mp4';

const SECTION_MESSAGES = {
  hero:           "I can generate your architecture in seconds! ⚡",
  features:       "Look at all these features I can build! 🏗️",
  'how-it-works': "Just 3 simple steps to production! 😄",
  testimonials:   "Developers worldwide love my work! ❤️",
  cta:            "Ready to build something amazing? 🚀",
};

const jokes = [
  "Stop poking me, I'm calculating your DB shards! 😵‍💫",
  "Did you know I dream in React components? ⚛️",
  "I'm 99% logic and 1% caffeine! ☕",
  "Loading... just kidding, I'm instant! ✨",
  "Architecture is art, and I'm the brush! 🎨",
];

const Mascot = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isHovered, setIsHovered] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const videoRef = useRef(null);
  const clickTimerRef = useRef(null);

  // Watch sections with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id || 'hero');
            setShowSpeech(true);
            setIsClicked(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = ['hero', 'features', 'how-it-works', 'testimonials', 'cta'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-reload video when section changes
  useEffect(() => {
    if (videoRef.current && !isClicked) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentSection, isClicked]);

  const handleMascotClick = () => {
    setClickCount(prev => (prev + 1) % jokes.length);
    setShowSpeech(true);
    setIsClicked(true);

    // After 5 seconds, return to section-based animation
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      setIsClicked(false);
    }, 5000);

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const currentVideo = isClicked ? CLICK_SPIN_VIDEO : (SECTION_VIDEOS[currentSection] || SECTION_VIDEOS.hero);
  const currentMessage = isClicked ? jokes[clickCount] : SECTION_MESSAGES[currentSection];

  if (!isVisible) return null;

  return (
    <>
    <style>{`
      .mascot-container { bottom: 40px; right: 40px; }
      .mascot-frame { width: 140px; height: 140px; }
      .mascot-speech { bottom: 160px; right: 10px; }
      @media (max-width: 480px) {
        .mascot-container { bottom: 16px; right: 12px; }
        .mascot-frame { width: 92px !important; height: 92px !important; }
        .mascot-speech { bottom: 108px; right: 6px; max-width: 170px !important; font-size: 0.75rem !important; }
      }
    `}</style>
    <div
      className="mascot-container"
      style={{
        position: 'fixed',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', pointerEvents: 'auto' }}>

        {/* ── SPEECH BUBBLE ── */}
        <AnimatePresence>
          {showSpeech && (
            <motion.div
              key={currentMessage}
              className="mascot-speech"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                background: 'white',
                padding: '12px 18px',
                borderRadius: '20px',
                borderBottomRightRadius: '3px',
                boxShadow: '0 8px 32px rgba(37,99,235,0.18)',
                border: '1px solid rgba(37,99,235,0.12)',
                width: 'max-content',
                maxWidth: '220px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                lineHeight: 1.4,
              }}
            >
              {currentMessage}

              {/* Triangle tail */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                right: '20px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid white',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MASCOT VIDEO ── */}
        <motion.div
          drag
          dragConstraints={{ left: -80, right: 20, top: -100, bottom: 10 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleMascotClick}
          animate={{
            y: [0, -8, 0],
            scale: isHovered ? 1.06 : 1,
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.2 },
          }}
          style={{
            cursor: 'grab',
            filter: 'drop-shadow(0 16px 40px rgba(37,99,235,0.35))',
          }}
        >
          {/* Circular Glass Frame */}
          <div className="mascot-frame" style={{
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'rgba(10, 15, 40, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '2.5px solid rgba(96, 165, 250, 0.5)',
            boxShadow: '0 0 0 4px rgba(37,99,235,0.12), 0 8px 40px rgba(37,99,235,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <video
              ref={videoRef}
              key={currentVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            >
              <source src={currentVideo} type="video/mp4" />
            </video>

            {/* Subtle inner glow ring */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 25%, rgba(96,165,250,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '11px',
              cursor: 'pointer',
              zIndex: 10,
              opacity: isHovered ? 1 : 0.3,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              color: '#374151',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </motion.div>

        {/* Status Indicator Dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '12px',
            height: '12px',
            background: '#10b981',
            borderRadius: '50%',
            boxShadow: '0 0 12px #10b981',
            zIndex: 11,
          }}
        />
      </div>
    </div>
    </>
  );
};

export default Mascot;
