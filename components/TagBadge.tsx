import React from 'react';
import type { Tag } from '../types';

interface TagBadgeProps {
  tag: Tag;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  // A simple fallback for safety
  const color = tag?.color || '#64748b';
  
  return (
    <span
      className="text-xs font-medium mr-1 mb-1 inline-block px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}50` }}
    >
      {tag?.name || '...'}
    </span>
  );
};
