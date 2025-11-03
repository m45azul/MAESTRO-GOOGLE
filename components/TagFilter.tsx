// This is a placeholder for a future, more complex implementation with a dropdown
// For now, it's a simplified version for demonstration purposes.
// A full implementation would use a library like react-select.

import React from 'react';
import { Tag } from '../types.ts';
import { TagBadge } from './TagBadge.tsx';

interface TagFilterProps {
  selectedTags: string[];
  onTagFilterChange: (tagIds: string[]) => void;
  allTags: Tag[];
}

export const TagFilter: React.FC<TagFilterProps> = ({ selectedTags, onTagFilterChange, allTags }) => {

  const handleTagClick = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagFilterChange(newSelectedTags);
  };

  return (
    <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Tags:</label>
        <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`transition-opacity rounded-full ${!selectedTags.includes(tag.id) && selectedTags.length > 0 ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
                >
                    <TagBadge tag={tag} />
                </button>
            ))}
        </div>
    </div>
  );
};