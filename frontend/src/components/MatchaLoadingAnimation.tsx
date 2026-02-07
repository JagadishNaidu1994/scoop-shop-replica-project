import React from 'react';

interface MatchaLoadingAnimationProps {
  message?: string;
  showSkeleton?: boolean;
}

const MatchaLoadingAnimation: React.FC<MatchaLoadingAnimationProps> = ({
  message = "Brewing your matcha experience...",
  showSkeleton = false
}) => {
  return (
    <div className="responsive-container py-8">
      {/* Matcha Loading Animation */}
      <div className="flex flex-col items-center justify-center py-16 mb-8">
        <div className="relative">
          {/* Matcha Bowl */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-green-100 to-green-200 border-4 border-green-800 relative overflow-hidden animate-pulse">
            {/* Matcha Liquid */}
            <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-green-400 to-green-300 rounded-b-full animate-[wave_2s_ease-in-out_infinite]"></div>
            {/* Foam/Bubbles */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-200 rounded-full opacity-60 animate-ping"></div>
          </div>
          {/* Steam */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite]"></div>
            <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite_0.3s]"></div>
            <div className="w-1 h-8 bg-gray-300 rounded-full opacity-40 animate-[steam_2s_ease-in-out_infinite_0.6s]"></div>
          </div>
        </div>
        <p className="mt-8 text-gray-600 font-medium animate-pulse">{message}</p>
      </div>

      {/* Optional Products Grid Skeleton */}
      {showSkeleton && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 0.2; }
          100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MatchaLoadingAnimation;
