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
  hero:           "I compile full system specs in seconds! ⚡",
  features:       "Review comprehensive MoSCoW features below! 🏗️",
  'how-it-works': "3 simple steps to production readiness! 😄",
  testimonials:   "Engineers worldwide rely on ArchitechAI! 🚀",
  cta:            "Ready to compile your next architecture? ⚡",
};

const jokes = [
  "Hold on, calculating distributed database shards! 😵‍💫",
  "Did you know I compile in pure Web3 brutalism? ⚡",
  "100% deterministic logic, zero fluff! ☕",
  "Loading... instant response delivered! ✨",
  "Clean code architecture is pure engineering art! 📐",
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

          {/* ── SPEECH BUBBLE (Neo-Brutalist) ── */}
          <AnimatePresence>
            {showSpeech && (
              <motion.div
                key={currentMessage}
                className="mascot-speech"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  border: '2.5px solid #000000',
                  boxShadow: '3px 3px 0px 0px #000000',
                  width: 'max-content',
                  maxWidth: '220px',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#000000',
                  lineHeight: 1.3,
                }}
              >
                {currentMessage}
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '20px',
                  width: '12px',
                  height: '8px',
                  background: '#000000',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
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
              y: [0, -6, 0],
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 },
            }}
            style={{
              cursor: 'grab',
            }}
          >
            {/* Circular Brutalist Frame */}
            <div className="mascot-frame" style={{
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#000000',
              border: '3px solid #000000',
              boxShadow: '4px 4px 0px 0px #000000',
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
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '24px',
                height: '24px',
                background: '#FF5500',
                color: '#FFFFFF',
                border: '2px solid #000000',
                fontSize: '11px',
                cursor: 'pointer',
                zIndex: 10,
                opacity: isHovered ? 1 : 0.4,
                transition: 'opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontFamily: 'Space Mono, monospace'
              }}
            >
              ✕
            </button>
          </motion.div>

          {/* Status Indicator Dot */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '12px',
              height: '12px',
              background: '#00FF00',
              border: '2px solid #000000',
              zIndex: 11,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Mascot;
