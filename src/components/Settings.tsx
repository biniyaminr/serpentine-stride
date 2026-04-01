import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Ban } from 'lucide-react';
import { Howl, Howler } from 'howler';

export const Settings: React.FC = () => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('snake-muted') === 'true';
  });
  const [bgm, setBgm] = useState<Howl | null>(null);

  useEffect(() => {
    // Background Music
    const music = new Howl({
      src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_c3708a3e79.mp3'], // "Happy Sandbox" 8-bit style
      loop: true,
      volume: 0.3,
      autoplay: !isMuted,
      onloaderror: (id, error) => console.log('BGM Load Error:', error)
    });

    setBgm(music);

    return () => {
      music.stop();
      music.unload();
    };
  }, []);

  useEffect(() => {
    if (bgm) {
      if (isMuted) {
        bgm.pause();
        Howler.mute(true);
      } else {
        bgm.play();
        Howler.mute(false);
      }
    }
    localStorage.setItem('snake-muted', String(isMuted));
  }, [isMuted, bgm]);

  return (
    <div className="flex flex-col gap-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Settings</h3>
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
          isMuted ? 'bg-slate-700/50 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'
        }`}
      >
        <span className="text-sm font-semibold">{isMuted ? 'Muted' : 'Audio On'}</span>
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};