import React from 'react';

interface IconProps {
  className?: string;
}

// 1. Logo Bát Quái Trigrams
export const IconBatQuai: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="square"
  >
    {/* Vành ngoài bát giác */}
    <polygon points="17,3 31,3 45,17 45,31 31,45 17,45 3,31 3,17" />
    <circle cx="24" cy="24" r="11" />
    {/* Âm Dương Thái Cực trong tâm */}
    <path
      d="M24 13a11 11 0 0 1 0 22 5.5 5.5 0 0 1 0-11 5.5 5.5 0 0 0 0-11z"
      fill="currentColor"
      opacity="0.3"
    />
    <circle cx="24" cy="18.5" r="1.5" fill="currentColor" />
    <circle cx="24" cy="29.5" r="1.5" fill="currentColor" />
    {/* Các vạch quẻ hào */}
    <line x1="21" y1="6" x2="27" y2="6" />
    <line x1="21" y1="42" x2="27" y2="42" />
    <line x1="6" y1="21" x2="6" y2="27" />
    <line x1="42" y1="21" x2="42" y2="27" />
  </svg>
);

// 2. Thái Cực Taiji
export const IconThaiCuc: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <circle cx="12" cy="12" r="10" />
    <path
      d="M12 2a10 10 0 0 0 0 20 5 5 0 0 0 0-10 5 5 0 0 1 0-10z"
      fill="currentColor"
      opacity="0.25"
    />
    <circle cx="12" cy="7" r="1.2" fill="currentColor" />
    <circle cx="12" cy="17" r="1.2" fill="currentColor" />
  </svg>
);

// 3. Con Dấu Ấn Triện Seal Stamp
export const IconAnTrien: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M7 7h4v4H7zM13 7h4v2h-4zM13 11h2v2h-2zM7 13h2v4H7zM11 15h6v2h-6z" fill="currentColor" opacity="0.3" />
  </svg>
);

// 4. Góc Hồi Văn (Meander Corner) trang trí góc khung song biên
export const IconMeanderCorner: React.FC<{ className?: string; position?: 'tl' | 'tr' | 'bl' | 'br' }> = ({
  className = 'w-4 h-4',
  position = 'tl'
}) => {
  let transform = '';
  if (position === 'tr') transform = 'scaleX(-1)';
  else if (position === 'bl') transform = 'scaleY(-1)';
  else if (position === 'br') transform = 'scale(-1, -1)';

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      style={{ transform }}
    >
      <path d="M2 2h20v4H8v12h12v4H2V2z" />
      <path d="M6 6h12v4h-8v4h8v2H6V6z" />
    </svg>
  );
};

// 5. Phân Cách Vân Văn / Cổ Tịch Divider
export const IconVanVanDivider: React.FC<IconProps> = ({ className = 'w-full h-3' }) => (
  <div className={`flex items-center justify-center gap-2 text-paper-gold dark:text-night-gold ${className}`}>
    <span className="h-[1px] w-12 bg-current opacity-40" />
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 2l3 7h7l-6 5 2 8-6-4-6 4 2-8-6-5h7z" />
    </svg>
    <span className="h-[1px] w-12 bg-current opacity-40" />
  </div>
);

// 6. Quạt Giấy Folding Fan
export const IconQuatGiay: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <path d="M12 21a10 10 0 0 0 9-5.5L12 11 3 15.5A10 10 0 0 0 12 21z" />
    <path d="M12 11v10" />
    <path d="M8 13.5l4 7.5" />
    <path d="M16 13.5l-4 7.5" />
  </svg>
);

// 7. Sách Mộc Bản Cổ Tịch (Book)
export const IconSachCo: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
    <path d="M6 2v20" />
    <line x1="10" y1="6" x2="16" y2="6" />
    <line x1="10" y1="10" x2="16" y2="10" />
  </svg>
);

// 8. La Bàn La Kinh (Compass)
export const IconLaKinh: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  </svg>
);

// 9. Nhật / Nguyệt Antique (Theme Toggle)
export const IconNhatThuc: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const IconNguyetThuc: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// 10. Bút Lông Calligraphy Brush (Họa Bút Whiteboard)
export const IconButLong: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M18 2l4 4-10 10-5 1 1-5L18 2z" />
    <path d="M7 17l-4 4a2 2 0 0 0 3 0l1-1" />
  </svg>
);

// 11. Khai Ấn Master CRM Folder
export const IconKhaiAn: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

// 12. Chu Sa Cinnabar Ink Drop
export const IconChuSa: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
