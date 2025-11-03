
import React from 'react';

interface SkeletonLoaderProps {
    className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
    return (
        <div className={`bg-slate-700/50 rounded-lg animate-pulse ${className}`}></div>
    );
};
