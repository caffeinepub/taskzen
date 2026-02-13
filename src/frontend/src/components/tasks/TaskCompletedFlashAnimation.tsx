import { useEffect, useState, useRef } from 'react';
import { HINDI_QUOTES } from '../../constants/taskCompletedHindiQuotes';
import { Sparkles, X } from 'lucide-react';

interface TaskCompletedFlashAnimationProps {
  triggerId: number;
  autoHideMs?: number;
}

export default function TaskCompletedFlashAnimation({
  triggerId,
  autoHideMs = 60000,
}: TaskCompletedFlashAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (triggerId > 0) {
      // Select a random quote
      const randomIndex = Math.floor(Math.random() * HINDI_QUOTES.length);
      setCurrentQuote(HINDI_QUOTES[randomIndex]);
      
      // Show the animation
      setIsVisible(true);

      // Auto-hide after specified duration
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, autoHideMs);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [triggerId, autoHideMs]);

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Flash/Glow Overlay */}
      <div className="absolute inset-0 animate-flash-glow" />
      
      {/* Quote Popup */}
      <div className="relative max-w-2xl mx-4 px-8 py-10 bg-card/95 backdrop-blur-sm rounded-3xl shadow-soft-xl border-2 border-primary/20 animate-quote-fade-in pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3 pr-6">
            <h3 className="text-lg font-semibold text-primary">Task Completed! 🎉</h3>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {currentQuote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
