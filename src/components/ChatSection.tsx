import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import type { ChatSectionProps, Message } from "../types/itinerary";

export default function ChatSection({
  messages,
  inputMessage,
  loading,
  onChangeMessage,
  onSendMessage,
}: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  // Generate welcome message once
  const welcomeMessageRef = useRef<Message>({
    id: "welcome-message",
    text: "Do you have anything in mind regarding my generated travel itinerary for you?",
    sender: "bot",
    timestamp: new Date(),
  });

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Messages */}
      <main className="max-w-3xl w-full mx-auto px-6 flex-1 overflow-y-auto py-4">
        <div className="flex flex-col space-y-4 justify-end min-h-full">
          {/* Hardcoded Welcome Message */}
          <ChatBubble message={welcomeMessageRef.current} />

          {/* Actual Chat Messages */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="self-start text-sm text-[rgb(var(--golden))] italic">
              Typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <footer className="max-w-3xl w-full mx-auto px-6 py-4 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => onChangeMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-[rgb(var(--golden))] px-5 py-3 rounded-full focus:outline-none placeholder-[rgb(var(--white))] text-[rgb(var(--white))] bg-transparent"
            disabled={loading}
          />
          <button
            onClick={onSendMessage}
            disabled={loading || !inputMessage.trim()}
            className="bg-[rgb(var(--golden))] text-black px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
