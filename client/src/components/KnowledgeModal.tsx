import React from 'react';
import {
  IconSachCo,
  IconLaKinh,
  IconMeanderCorner
} from './OrientalIcons';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-paper-card dark:bg-night-card border-2 border-paper-gold/80 dark:border-night-gold/80 rounded-none max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl relative animate-fadeIn">
        {/* Góc Hồi Văn */}
        <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-paper-border dark:border-night-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-paper-gold dark:border-night-gold flex items-center justify-center bg-paper-cardAlt dark:bg-night-cardAlt text-paper-red dark:text-night-gold">
              <IconSachCo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold">
                Cẩm Nang Kiến Thức Tử Vi Đẩu Số
              </h3>
              <p className="text-xs text-paper-muted dark:text-night-muted">
                Nguyên lý căn bản về Thập Tứ Chính Tinh & Thập Nhị Cung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1 text-paper-muted hover:text-paper-text dark:text-night-muted dark:hover:text-night-text cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-paper-text dark:text-night-text leading-relaxed">
          {/* Section 1: 14 Chính Tinh */}
          <div className="p-3.5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border">
            <h4 className="font-serif font-bold text-paper-red dark:text-night-gold mb-2 flex items-center gap-1.5">
              <IconLaKinh className="w-4 h-4 text-paper-gold" />
              1. Thập Tứ Chính Tinh (14 Ngôi Sao Chủ Đạo)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <strong className="text-paper-red dark:text-night-gold block font-serif">Chòm Tử Vi (Bắc Đẩu):</strong>
                <p>• <strong>Tử Vi (Thổ):</strong> Đế tòa, chủ quyền quý, phúc lộc.</p>
                <p>• <strong>Thiên Cơ (Mộc):</strong> Trí tuệ, mưu lược, biến chuyển.</p>
                <p>• <strong>Thái Dương (Hỏa):</strong> Mặt trời, quang minh, danh tiếng.</p>
                <p>• <strong>Vũ Khúc (Kim):</strong> Tài tinh, quả quyết, hành động.</p>
                <p>• <strong>Thiên Đồng (Thủy):</strong> Phúc tinh, hòa nhã, hưởng lạc.</p>
                <p>• <strong>Liêm Trinh (Hỏa):</strong> Tù tinh, nghiêm nghị, lý tưởng.</p>
              </div>
              <div>
                <strong className="text-paper-gold dark:text-night-gold block font-serif">Chòm Thiên Phủ (Nam Đẩu):</strong>
                <p>• <strong>Thiên Phủ (Thổ):</strong> Lệnh tinh, kho trời, điềm đạm.</p>
                <p>• <strong>Thái Âm (Thủy):</strong> Mặt trăng, nội tâm, phú túc.</p>
                <p>• <strong>Tham Lang (Thủy):</strong> Đào hoa, dục vọng, cơ biến.</p>
                <p>• <strong>Cự Môn (Thủy):</strong> Ám tinh, ngôn ngữ, biện tài.</p>
                <p>• <strong>Thiên Tướng (Thủy):</strong> Ấn tinh, trượng nghĩa, phò tá.</p>
                <p>• <strong>Thiên Lương (Mộc):</strong> Ấm tinh, thọ khảo, kỷ cương.</p>
                <p>• <strong>Thất Sát (Kim):</strong> Tướng tinh, sát phạt, uy dũng.</p>
                <p>• <strong>Phá Quân (Thủy):</strong> Hao tinh, tiên phong, khai phá.</p>
              </div>
            </div>
          </div>

          {/* Section 2: 12 Cung Vị */}
          <div className="p-3.5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border">
            <h4 className="font-serif font-bold text-paper-red dark:text-night-gold mb-2 flex items-center gap-1.5">
              <IconLaKinh className="w-4 h-4 text-paper-gold" />
              2. Thập Nhị Cung (12 Phương Diện Đời Người)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <p>• <strong>Mệnh:</strong> Căn bản, tư chất, hình tướng.</p>
              <p>• <strong>Phụ Mẫu:</strong> Cha mẹ, ơn đức bề trên.</p>
              <p>• <strong>Phúc Đức:</strong> Tổ tiên, thọ mạng, tinh thần.</p>
              <p>• <strong>Điền Trạch:</strong> Nhà cửa, đất đai, tài sản.</p>
              <p>• <strong>Quan Lộc:</strong> Sự nghiệp, danh phận, công vụ.</p>
              <p>• <strong>Nô Bộc:</strong> Bạn bè, cấp dưới, cộng sự.</p>
              <p>• <strong>Thiên Di:</strong> Xã hội ngoài, xuất ngoại, giao tế.</p>
              <p>• <strong>Tật Ách:</strong> Bệnh tật, tai ương, thân thể.</p>
              <p>• <strong>Tài Bạch:</strong> Tiền bạc, tài chính, nguồn thu.</p>
              <p>• <strong>Tử Tức:</strong> Con cái, hậu duệ, sự kế tục.</p>
              <p>• <strong>Phu Thê:</strong> Hôn nhân, bạn đời, duyên nợ.</p>
              <p>• <strong>Huynh Đệ:</strong> Anh chị em, cộng sự tương hỗ.</p>
            </div>
          </div>

          {/* Section 3: Tam Phương Tứ Chính & Tứ Hóa */}
          <div className="p-3.5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border">
            <h4 className="font-serif font-bold text-paper-red dark:text-night-gold mb-2 flex items-center gap-1.5">
              <IconLaKinh className="w-4 h-4 text-paper-gold" />
              3. Tam Phương Tứ Chính & Khâm Thiên Tứ Hóa
            </h4>
            <p className="text-xs text-paper-muted dark:text-night-muted mb-2">
              • <strong>Tam Phương Tứ Chính:</strong> Mỗi cung chịu sự chi phối mạnh mẽ nhất từ 2 cung Tam Hợp (cách 4 cung) và 1 cung Xung Chiếu (đối diện cách 6 cung).
            </p>
            <p className="text-xs text-paper-muted dark:text-night-muted">
              • <strong>Tứ Hóa Tiên Thiên:</strong> Hóa Lộc (Duyên sinh, hanh thông), Hóa Quyền (Thế lực, năng lực hành động), Hóa Khoa (Danh tiếng, quý nhân giải trừ hung họa), Hóa Kỵ (Áp lực, chấp niệm, khảo nghiệm tôi luyện).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
