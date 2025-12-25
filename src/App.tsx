
import React, { useState, useRef, useEffect } from 'react';
import { CharacterType, ChatMessage } from './types';
import { processWorry } from "./services/geminiService";
import ChatBubble from './components/ChatBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: CharacterType.AI,
      content: '「解体診処」へようこそ。どのようなお悩みをお抱えですか？江戸の蘭学者たちと共に、あなたの抱える問題を解体し、診察いたしましょう。',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: CharacterType.USER,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await processWorry(inputValue);
      
      const analysisMsg: ChatMessage = {
        id: `analysis-${Date.now()}`,
        sender: CharacterType.AI,
        content: response.analysis,
        timestamp: new Date(),
        isAnalysis: true
      };

      const characterMessages: ChatMessage[] = response.messages.map((m, idx) => ({
        id: `res-${Date.now()}-${idx}`,
        sender: m.sender,
        content: m.content,
        timestamp: new Date()
      }));

      // Simulate character arrival delay
      setMessages(prev => [...prev, analysisMsg]);
      
      for (const msg of characterMessages) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages(prev => [...prev, msg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-[#f7f3e9] shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      
      {/* Header */}
      <header className="bg-stone-900 text-stone-100 p-4 border-b-4 border-amber-600 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-600 p-2 rounded text-xl font-bold serif">解体診処</div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase opacity-80">Kaitai Shinsho</h1>
            <p className="text-[10px] italic opacity-60">Edo Logic & AI Empathy</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold">稼働中</span>
        </div>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 relative z-0 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-stone-400 italic text-xs ml-2 animate-bounce">
            <span className="serif">診察中...</span>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-stone-200 z-10">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="お悩みをお聞かせください..."
            className="flex-1 px-4 py-3 bg-stone-100 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-indigo-700 disabled:bg-stone-300 disabled:shadow-none transition-all active:scale-95"
          >
            解体
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-stone-400 font-medium">
          ※蘭学者たちはカタカナ用語を理解できない場合があります。
        </p>
      </footer>
    </div>
  );
};

export default App;
