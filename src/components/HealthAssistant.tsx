import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Trash2, X, FileText, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  attachments?: File[];
  timestamp: string;
}

export function HealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello John. I'm your Pulse Health Assistant. I can help you understand your symptoms, check medication schedules, or prepare for your next appointment. How can I assist you today?",
      timestamp: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (inputText.trim() === '' && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setAttachments([]);
    
    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I've received your message. I'm analyzing the details now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: "Hello John. I'm your Pulse Health Assistant. I can help you understand your symptoms, check medication schedules, or prepare for your next appointment. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#005bb5] rounded-full flex items-center justify-center text-white font-bold text-[14px]">
            PA
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">Pulse AI Assistant</h2>
            <div className="flex items-center text-[12px] text-on-surface-variant">
              <span className="w-2 h-2 bg-[#059669] rounded-full mr-1.5"></span>
              Secured clinical AI active
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center px-4 py-2 border border-outline-variant rounded-full text-[13px] font-medium text-on-surface-variant hover:bg-[#f8fafc] transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user' 
                    ? 'bg-[#005bb5] text-white rounded-br-sm' 
                    : 'bg-white border border-outline-variant text-on-surface rounded-bl-sm shadow-sm'
                }`}
              >
                {message.text && (
                  <p className={`text-[15px] leading-relaxed ${message.sender === 'user' ? 'text-white' : 'text-on-surface'}`}>
                    {message.text}
                  </p>
                )}
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className={`flex flex-wrap gap-2 ${message.text ? 'mt-3' : ''}`}>
                    {message.attachments.map((file, i) => (
                      <div key={i} className={`flex items-center p-2 rounded-lg text-[13px] ${message.sender === 'user' ? 'bg-white/20' : 'bg-[#f1f5f9]'}`}>
                        {file.type.includes('image') ? (
                          <ImageIcon className="w-4 h-4 mr-2" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1.5 px-1">
                {message.timestamp}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-outline-variant">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-[#f1f5f9] rounded-lg pl-3 pr-1 py-1 text-[13px] border border-outline-variant">
                {file.type.includes('image') ? (
                  <ImageIcon className="w-4 h-4 text-on-surface-variant mr-2" />
                ) : (
                  <FileText className="w-4 h-4 text-on-surface-variant mr-2" />
                )}
                <span className="truncate max-w-[150px] mr-2 text-on-surface">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="p-1 hover:bg-[#e2e8f0] rounded-md transition-colors text-on-surface-variant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center">
          <div className="flex-1 bg-[#f8fafc] border border-outline-variant rounded-full flex items-center pr-2 pl-4 py-2 transition-colors focus-within:border-[#005bb5] focus-within:bg-white focus-within:shadow-sm">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-on-surface-variant hover:text-[#005bb5] hover:bg-[#eff6ff] rounded-full transition-colors mr-2"
              title="Attach File (JPG, PNG, PDF)"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your health..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-on-surface placeholder:text-on-surface-variant py-2"
            />
            <button 
              onClick={handleSend}
              disabled={inputText.trim() === '' && attachments.length === 0}
              className={`p-3 rounded-full ml-2 flex items-center justify-center transition-all ${
                inputText.trim() !== '' || attachments.length > 0
                  ? 'bg-[#005bb5] text-white hover:bg-[#004a99] shadow-md'
                  : 'bg-[#e2e8f0] text-[#94a3b8]'
              }`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
            Medical data is encrypted and HIPAA compliant
          </p>
        </div>
      </div>
    </div>
  );
}
