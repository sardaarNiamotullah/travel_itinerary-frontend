import { useState, useRef, useEffect } from "react";
import { fetchItinerary, sendAIMessage } from "../api/api";
import type { ItineraryResponse } from "../types/itinerary";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`max-w-md px-4 py-3 rounded-2xl shadow text-sm break-words ${
        isUser
          ? "bg-[rgb(var(--blue))] text-white self-end"
          : "bg-white text-black border border-gray-200 self-start"
      }`}
    >
      <p className="whitespace-pre-line">{message.text}</p>
      <p
        className={`text-xs text-right mt-2 ${
          isUser ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchItinerary(destination, date);
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiRequestPayload = {
        message: userMessage.text,
        ...(result?.ai_itinerary
          ? { itinerary_data: result.ai_itinerary }
          : {}),
      };

      const response = await sendAIMessage(aiRequestPayload);

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Failed to get AI reply:", error);
      const errorReply: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, something went wrong while fetching the AI reply.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="h-screen flex flex-col bg-[color:var(--blue-light)] text-black overflow-hidden">
      {/* Header Section */}
      <header className="max-w-3xl w-full mx-auto p-6 pt-12 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-[rgb(var(--blue))] mb-6">
          🌍 Travel Assistant
        </h1>
        <div className="space-y-4 p-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-gray-300 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
            placeholder="YYYY-MM-DD"
          />
          <button
            onClick={handleSubmitSearch}
            className="w-full bg-[rgb(var(--blue))] text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>

          {error && <p className="text-red-600">{error}</p>}

          {result && (
            <div className="bg-white p-4 rounded-xl shadow space-y-4">
              <h2 className="text-xl font-bold text-[rgb(var(--blue))]">
                Itinerary Suggestion
              </h2>
              <p>{result.ai_itinerary}</p>
              <h3 className="font-semibold">3-Day Forecast:</h3>
              <ul className="space-y-2">
                {result.forecast.map((day, index) => (
                  <li key={index} className="border p-2 rounded-md">
                    <p>
                      <strong>{day.day}</strong>: {day.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Chat Section */}
      <main className="max-w-3xl w-full mx-auto px-6 overflow-y-auto flex-1 py-4 max-h-[62vh]">
        <div className="flex flex-col space-y-4 min-h-full justify-end">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="self-start text-sm text-gray-500 italic">
              Typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="max-w-3xl w-full mx-auto px-6 py-4 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 px-5 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-[rgb(var(--blue))] text-white px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
