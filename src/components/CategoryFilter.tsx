'use client';

import { categories, type Category } from '@/lib/spa-data';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => onSelect('all')}
        className={`font-body text-sm px-6 py-2 tracking-wide transition-all ${
          selected === 'all'
            ? 'bg-gold text-white'
            : 'bg-cream text-charcoal hover:bg-gold/20'
        }`}
      >
        All Treatments
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`font-body text-sm px-6 py-2 tracking-wide transition-all ${
            selected === category
              ? 'bg-gold text-white'
              : 'bg-cream text-charcoal hover:bg-gold/20'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
