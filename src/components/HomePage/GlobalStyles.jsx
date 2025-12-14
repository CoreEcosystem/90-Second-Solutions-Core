export function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&family=Poppins:wght@500&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@500&display=swap');
      
      .font-roboto-serif {
        font-family: 'Roboto Serif', serif;
      }
      
      .font-montserrat {
        font-family: 'Montserrat', sans-serif;
      }
      
      .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
      
      .font-rethink-sans {
        font-family: 'Rethink Sans', sans-serif;
      }

      /* Breathing ring animation */
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .breathing-ring:hover {
        animation: breathe 2s ease-in-out infinite;
      }

      /* Enhanced card hover effects */
      .card-hover {
        transition: all 0.3s ease-out;
      }

      .card-hover:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(83, 136, 144, 0.15);
      }

      /* Pulsing dot animation (used in CTAs) */
      @keyframes pulse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1); 
        }
        50% { 
          opacity: 0.7; 
          transform: scale(1.2); 
        }
      }

      .pulsing-dot {
        width: 8px;
        height: 8px;
        background-color: #538890;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      }

      /* Softer pulse for timeline dots */
      @keyframes softPulse {
        0%, 100% {
          opacity: 0.9;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.08);
        }
      }
      .soft-pulse {
        animation: softPulse 2.8s ease-in-out infinite;
      }

      /* Fade-in on scroll for How It Works */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in-on-scroll { opacity: 0; transform: translateY(12px); }
      /* Slower fade-in for a smoother reveal */
      .fade-in-on-scroll.is-visible { animation: fadeInUp 900ms ease-out forwards; }

      /* Ensure proper tap targets on mobile */
      @media (max-width: 768px) {
        button, a {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      }
    `}</style>
  );
}
