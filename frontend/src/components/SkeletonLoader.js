import React from 'react';

const SkeletonPulse = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-2xl ${className}`} />
);

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
    <SkeletonPulse className="h-56 w-full rounded-none" />
    <div className="space-y-4 p-6">
      <SkeletonPulse className="h-4 w-3/4" />
      <SkeletonPulse className="h-4 w-1/2" />
      <div className="flex gap-2">
        <SkeletonPulse className="h-8 w-20 rounded-full" />
        <SkeletonPulse className="h-8 w-20 rounded-full" />
      </div>
      <SkeletonPulse className="h-16 w-full" />
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <SkeletonPulse className="h-6 w-24" />
        <SkeletonPulse className="h-6 w-16" />
      </div>
    </div>
  </div>
);

const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonPulse
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

export { SkeletonPulse, SkeletonCard, SkeletonGrid, SkeletonText };
export default SkeletonCard;
