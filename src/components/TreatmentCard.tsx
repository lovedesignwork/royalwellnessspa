import Link from 'next/link';
import { Clock, Sparkles } from 'lucide-react';
import type { Treatment } from '@/lib/spa-data';

interface TreatmentCardProps {
  treatment: Treatment;
}

export default function TreatmentCard({ treatment }: TreatmentCardProps) {
  const isSignature = treatment.notes.toLowerCase().includes('signature');

  return (
    <div className="card-hover bg-white rounded-sm overflow-hidden shadow-md group">
      <div className="relative h-48 bg-gradient-to-br from-cream to-sage/30 flex items-center justify-center">
        {isSignature && (
          <div className="absolute top-4 right-4 bg-gold text-white text-xs font-[var(--font-montserrat)] px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            SIGNATURE
          </div>
        )}
        <div className="text-center px-6">
          <h3 className="font-display text-2xl text-charcoal group-hover:text-gold transition-colors">
            {treatment.name}
          </h3>
          <p className="text-sm text-gold font-[var(--font-montserrat)] mt-2">
            {treatment.category}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="font-[var(--font-montserrat)] text-sm text-charcoal/70 mb-4 line-clamp-2">
          {treatment.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-charcoal/60 font-[var(--font-montserrat)] mb-4">
          <Clock className="w-4 h-4" />
          <span>{treatment.duration}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {treatment.highlights.slice(0, 3).map((highlight, idx) => (
            <span
              key={idx}
              className="text-xs font-[var(--font-montserrat)] bg-cream text-charcoal/70 px-2 py-1 rounded-sm"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cream">
          <div>
            <span className="font-display text-2xl text-gold">
              ฿{treatment.price}
            </span>
          </div>
          <Link
            href={`/book?treatment=${treatment.id}`}
            className="btn-luxury bg-charcoal hover:bg-gold text-white font-[var(--font-montserrat)] text-xs px-4 py-2 tracking-wide"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
