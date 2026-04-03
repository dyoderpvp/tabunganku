import React, { useState } from "react";
import { AVATAR_COLORS } from "../types";
import { Check, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";

interface ProfileEditorProps {
  displayName: string;
  avatarColor: string;
  onUpdate: (name: string, color: string) => void;
  accentColor: string;
}

export function ProfileEditor({ displayName, avatarColor, onUpdate, accentColor }: ProfileEditorProps) {
  const [name, setName] = useState(displayName);
  const [color, setColor] = useState(avatarColor);

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gray-50" style={{ color: accentColor }}>
          <UserIcon size={24} />
        </div>
        <h3 className="text-xl font-light text-gray-900">Pengaturan Profil</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Nama Tampilan</label>
          <input 
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all text-lg"
            style={{ "--tw-ring-color": accentColor } as any}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Warna Profil</label>
          <div className="flex flex-wrap gap-3">
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: c }}
              >
                {color === c && <Check size={18} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => onUpdate(name, color)}
          className="w-full py-4 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          style={{ backgroundColor: accentColor }}
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
