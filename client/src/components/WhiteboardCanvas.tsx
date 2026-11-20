import React, { useRef, useEffect, useState } from 'react';
import {
  IconButLong,
  IconChuSa,
  IconAnTrien,
  IconKhaiAn
} from './OrientalIcons';

interface WhiteboardCanvasProps {
  isActive: boolean;
  chartContainerId: string;
  onClose: () => void;
}

type DrawTool = 'pen' | 'circle' | 'arrow';

interface DrawAction {
  tool: DrawTool;
  color: string;
  lineWidth: number;
  points: { x: number; y: number }[];
}

const COLORS = [
  { name: 'Chu Sa (Đỏ)', value: '#9E2A22' },
  { name: 'Đồng Kim (Vàng)', value: '#9A7B3E' },
  { name: 'Thanh Ngọc (Xanh)', value: '#245B43' }
];

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  isActive,
  chartContainerId,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTool, setCurrentTool] = useState<DrawTool>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#9E2A22');
  const [currentWidth, setCurrentWidth] = useState<number>(2.5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const currentActionRef = useRef<DrawAction | null>(null);

  // Sync canvas dimensions with chart container
  useEffect(() => {
    if (!isActive) return;

    const resizeCanvas = () => {
      const container = document.getElementById(chartContainerId);
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        redrawAll(actions, ctx);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isActive, chartContainerId, actions]);

  const redrawAll = (actionList: DrawAction[], ctx?: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = ctx || canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    actionList.forEach((act) => {
      drawSingleAction(act, context);
    });
  };

  const drawSingleAction = (act: DrawAction, ctx: CanvasRenderingContext2D) => {
    if (act.points.length < 2 && act.tool === 'pen') return;

    ctx.save();
    ctx.strokeStyle = act.color;
    ctx.fillStyle = act.color;
    ctx.lineWidth = act.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (act.tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(act.points[0].x, act.points[0].y);
      for (let i = 1; i < act.points.length; i++) {
        ctx.lineTo(act.points[i].x, act.points[i].y);
      }
      ctx.stroke();
    } else if (act.tool === 'circle') {
      const start = act.points[0];
      const end = act.points[act.points.length - 1];
      const radiusX = Math.abs(end.x - start.x) / 2;
      const radiusY = Math.abs(end.y - start.y) / 2;
      const centerX = Math.min(start.x, end.x) + radiusX;
      const centerY = Math.min(start.y, end.y) + radiusY;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, Math.max(radiusX, 5), Math.max(radiusY, 5), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (act.tool === 'arrow') {
      const start = act.points[0];
      const end = act.points[act.points.length - 1];

      // Draw line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw arrow head
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headlen = 10 * (act.lineWidth / 2);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }

    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const p = getCanvasCoords(e);
    const newAct: DrawAction = {
      tool: currentTool,
      color: currentColor,
      lineWidth: currentWidth,
      points: [p]
    };
    currentActionRef.current = newAct;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentActionRef.current) return;
    const p = getCanvasCoords(e);
    currentActionRef.current.points.push(p);

    // Live preview
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      redrawAll(actions, ctx);
      drawSingleAction(currentActionRef.current, ctx);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentActionRef.current && currentActionRef.current.points.length > 0) {
      setActions((prev) => [...prev, currentActionRef.current!]);
      currentActionRef.current = null;
    }
  };

  const handleUndo = () => {
    setActions((prev) => {
      const next = prev.slice(0, prev.length - 1);
      redrawAll(next);
      return next;
    });
  };

  const handleClear = () => {
    setActions([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    }
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none">
      {/* Drawing Canvas Overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair touch-none"
      />

      {/* Floating Toolbar on Canvas */}
      <div className="absolute top-2 right-2 pointer-events-auto flex flex-wrap items-center gap-1.5 p-1.5 bg-paper-card/95 dark:bg-night-card/95 border border-paper-border dark:border-night-border shadow-md text-xs font-serif">
        <div className="flex items-center gap-1 pr-2 border-r border-paper-border dark:border-night-border">
          <span className="text-[11px] font-bold text-paper-red dark:text-night-gold flex items-center gap-1">
            <IconButLong className="w-3.5 h-3.5 text-paper-red dark:text-night-gold" />
            Họa Bút
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentTool('pen')}
            className={`px-2 py-1 text-xs border ${
              currentTool === 'pen'
                ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
            }`}
            title="Bút vẽ tự do"
          >
            Vẽ
          </button>
          <button
            type="button"
            onClick={() => setCurrentTool('circle')}
            className={`px-2 py-1 text-xs border ${
              currentTool === 'circle'
                ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
            }`}
            title="Khoanh vùng tinh diệu"
          >
            Khoanh
          </button>
          <button
            type="button"
            onClick={() => setCurrentTool('arrow')}
            className={`px-2 py-1 text-xs border ${
              currentTool === 'arrow'
                ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
            }`}
            title="Mũi tên chỉ hướng Phi Hóa"
          >
            Mũi Tên
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1 px-2 border-x border-paper-border dark:border-night-border">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCurrentColor(c.value)}
              className={`w-4 h-4 border ${
                currentColor === c.value ? 'ring-2 ring-paper-gold scale-110' : 'border-gray-400 opacity-80'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        {/* Stroke Width */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentWidth(1.8)}
            className={`px-1.5 py-0.5 text-[10px] border ${
              currentWidth < 2 ? 'bg-paper-gold/20 font-bold' : 'border-paper-border'
            }`}
          >
            Mảnh
          </button>
          <button
            type="button"
            onClick={() => setCurrentWidth(3.5)}
            className={`px-1.5 py-0.5 text-[10px] border ${
              currentWidth >= 2 ? 'bg-paper-gold/20 font-bold' : 'border-paper-border'
            }`}
          >
            Đậm
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-2 border-l border-paper-border dark:border-night-border">
          <button
            type="button"
            onClick={handleUndo}
            disabled={actions.length === 0}
            className="px-2 py-1 text-xs border border-paper-border dark:border-night-border hover:bg-paper-cardAlt disabled:opacity-30"
          >
            Hoàn
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={actions.length === 0}
            className="px-2 py-1 text-xs border border-paper-border dark:border-night-border hover:bg-paper-cardAlt disabled:opacity-30"
          >
            Xóa
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs bg-paper-border dark:bg-night-border text-paper-text dark:text-night-text hover:bg-paper-red hover:text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
