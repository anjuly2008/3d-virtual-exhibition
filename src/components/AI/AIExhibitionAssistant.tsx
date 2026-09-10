import { useEffect, useRef, useState } from 'react';
import { Send, X, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  reply?: string;
  error?: string;
  fallback?: boolean;
}

export default function AIExhibitionAssistant() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const baseUrl = import.meta.env.BASE_URL;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好，我是你的3D虚拟展览助手，可以帮助你了解展览、作品和艺术信息。',
    },
  ]);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };

    document.body.style.userSelect = 'none';
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragRef.current.dragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    setPosition({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy,
    });
  };

  const handleDragEnd = () => {
    dragRef.current.dragging = false;
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.body.style.userSelect = '';
    };
  }, []);

  const handleSend = async () => {
    const text = message.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: text,
      },
    ]);

    setMessage('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const responseText = await response.text();

      let data: AIResponse = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('AI服务器返回的数据格式异常');
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error || `AI请求失败（HTTP ${response.status}）`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'AI暂时没有返回回答。',
        },
      ]);
    } catch (err) {
      console.error('[AI Assistant Error]', err);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err instanceof Error
              ? err.message
              : 'AI助手暂时无法响应，请稍后再试。',
        },
      ]);
    }
  };

  const active = hovered || open;

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60]">
        <button
          type="button"
          aria-label="打开AI展览助手"
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="block rounded-full outline-none transition-transform duration-300"
          style={{
            transform: active ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <img
            src={
              active
                ? `${baseUrl}icons/54.gif`
                : `${baseUrl}icons/53.gif`
            }
            alt="AI助手小宇"
            className="w-20 h-20 object-contain"
          />
        </button>
      </div>

      {open && (
        <div
          className="ai-chat-window fixed top-1/2 left-1/2 z-[59] w-[420px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
          style={{
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-move"
            onMouseDown={handleDragStart}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  3D展览助手
                </div>

                <div className="text-xs text-slate-400">
                  AI Exhibition Assistant
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              onMouseDown={(e) => e.stopPropagation()}
              className="glass-icon-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[360px] overflow-y-auto p-4 space-y-3">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    item.role === 'user'
                      ? 'bg-white/15 text-white'
                      : 'bg-black/20 text-slate-200'
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="输入你想了解的问题..."
                className="glass-input flex-1"
              />

              <button
                type="button"
                onClick={handleSend}
                className="glass-btn p-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}