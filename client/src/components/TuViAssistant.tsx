import React, { useState } from 'react';
import { ChartData } from '../types';
import {
  IconBatQuai,
  IconAnTrien,
  IconLaKinh,
  IconMeanderCorner
} from './OrientalIcons';
import { answerTuViQuestion } from '../engine';
import { safeJsonFetch } from '../utils/api';

interface TuViAssistantProps {
  chart: ChartData;
  selectedPalaceName: string;
}

interface AssistantMessage {
  type: 'user' | 'assistant';
  content: string;
  advice?: string;
  relatedPalaces?: string[];
}

export const TuViAssistant: React.FC<TuViAssistantProps> = ({ chart, selectedPalaceName }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      type: 'assistant',
      content: `Xin chào đương số ${chart.thienBan.fullName}! Tôi là Trợ Lý Tử Vi Minh Khuê. Bạn muốn giải đoán về Sự nghiệp, Tài lộc, Tình duyên, Vận hạn năm ${chart.thienBan.viewingYear}, hay khảo sát Lai Nhân Cung & Tứ Hóa Phi Tinh? Hãy chọn câu hỏi gợi ý bên dưới hoặc tự do đặt câu hỏi.`
    }
  ]);

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || isLoading) return;

    const userMsg: AssistantMessage = { type: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      let data: any = null;
      try {
        const res = await safeJsonFetch<{ success: boolean; data: any }>('/api/laso/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chart,
            question: q,
            selectedPalaceName,
            school: chart.school
          })
        });

        if (res.ok && res.data?.success && res.data.data) {
          data = res.data.data;
        }
      } catch {
        // Backend offline, fallback to in-browser engine below
      }

      // Seamless fallback to client-side engine if server is offline or returned error
      if (!data) {
        data = answerTuViQuestion(chart, q, selectedPalaceName, chart.school);
      }

      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: data.answer,
          advice: data.advice,
          relatedPalaces: data.relatedPalaces
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: 'Không thể giải đoán câu hỏi này lúc này. Bạn vui lòng thử lại với các câu hỏi gợi ý bên dưới.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Sự nghiệp & Công danh của tôi',
    'Tài lộc & Kinh doanh đầu tư',
    'Tình duyên & Hôn nhân gia đạo',
    `Vận hạn năm ${chart.thienBan.viewingYear}`,
    'Luận giải Bắc Phái & Lai Nhân Cung',
    `Khảo sát Phi Tinh Tứ Hóa cung ${selectedPalaceName || 'Mệnh'}`
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 bg-paper-card dark:bg-night-card border-2 border-paper-gold/60 dark:border-night-gold/60 p-4 sm:p-5 rounded-none shadow-xs">
      {/* Góc Hồi Văn */}
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
      <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
      <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-paper-border dark:border-night-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-paper-gold dark:border-night-gold flex items-center justify-center bg-paper-cardAlt dark:bg-night-cardAlt text-paper-red dark:text-night-gold">
            <IconBatQuai className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold leading-tight">
              Trợ Lý Tử Vi Minh Khuê (AI)
            </h3>
            <p className="text-[10px] text-paper-muted dark:text-night-muted">
              Luận giải chuyên sâu theo 4 trường phái • Ngữ cảnh cung {selectedPalaceName || 'Mệnh'}
            </p>
          </div>
        </div>

        <span className="seal-stamp text-[9px]">
          MỘC BẢN THƯ KÝ
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs leading-relaxed mb-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 border rounded-none ${
                m.type === 'user'
                  ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border-paper-redHover font-serif'
                  : 'bg-paper-cardAlt dark:bg-night-cardAlt border-paper-border dark:border-night-border text-paper-text dark:text-night-text'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {/* Advice Box if assistant */}
              {m.advice && (
                <div className="mt-2 pt-2 border-t border-paper-border/60 text-[11px] space-y-1">
                  <div className="flex items-center gap-1 text-paper-red dark:text-night-gold font-serif font-bold">
                    <IconAnTrien className="w-3 h-3" />
                    <span>Lời Khuyên Hành Xử:</span>
                  </div>
                  <p className="italic text-paper-muted dark:text-night-muted">{m.advice}</p>
                </div>
              )}

              {/* Related Palaces Tags */}
              {m.relatedPalaces && m.relatedPalaces.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-paper-muted">Cung vị liên quan:</span>
                  {m.relatedPalaces.map((pName) => (
                    <span
                      key={pName}
                      className="px-1.5 py-0.2 bg-paper-card dark:bg-night-card border border-paper-border font-serif"
                    >
                      {pName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border text-xs text-paper-muted flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-paper-gold border-t-transparent animate-spin" />
              <span>Đang tra cứu cổ thư và giải mã cung vị...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-paper-border dark:border-night-border">
        <span className="text-[10px] text-paper-muted flex items-center gap-1 font-serif">
          <IconLaKinh className="w-3 h-3 text-paper-gold" />
          <span>Gợi ý:</span>
        </span>
        {QUICK_QUESTIONS.map((qText) => (
          <button
            key={qText}
            type="button"
            disabled={isLoading}
            onClick={() => handleAsk(qText)}
            className="px-2 py-1 text-[11px] bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border hover:border-paper-gold hover:text-paper-red text-paper-text dark:text-night-text transition-colors cursor-pointer rounded-none disabled:opacity-50"
          >
            {qText}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 pt-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAsk();
          }}
          disabled={isLoading}
          placeholder="Nhập câu hỏi tử vi bạn muốn giải đoán..."
          className="flex-1 px-3 py-2 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold rounded-none"
        />
        <button
          type="button"
          disabled={isLoading || !question.trim()}
          onClick={() => handleAsk()}
          className="px-4 py-2 bg-paper-red hover:bg-paper-redHover text-paper-bg dark:bg-night-red dark:text-night-bg text-xs font-serif font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 rounded-none border border-paper-redHover"
        >
          <span>Gửi Hỏi</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};
