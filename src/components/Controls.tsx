import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  onDirectionChange: (dir: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="flex flex-col gap-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Controls</h3>
      <div className="grid grid-cols-3 grid-rows-2 gap-1 w-full max-w-[120px] mx-auto">
        <div />
        <button
          onClick={() => onDirectionChange('UP')}
          className="aspect-square flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg active:scale-95 transition-all shadow-inner"
        >
          <ChevronUp size={20} />
        </button>
        <div />
        <button
          onClick={() => onDirectionChange('LEFT')}
          className="aspect-square flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg active:scale-95 transition-all shadow-inner"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => onDirectionChange('DOWN')}
          className="aspect-square flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg active:scale-95 transition-all shadow-inner"
        >
          <ChevronDown size={20} />
        </button>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          className="aspect-square flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg active:scale-95 transition-all shadow-inner"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};