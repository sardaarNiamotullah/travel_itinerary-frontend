import { useState } from "react";
import { fetchItinerary, sendAIMessage } from "../api/api";

import ItineraryInputForm from "../components/ItineraryInputForm";
import GeneratedItinerary from "../components/GeneratedItinerary";
import ChatSection from "../components/ChatSection";

import type { Message, ItineraryResponse } from "../types/itinerary";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchItinerary(destination, date);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
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
    setLoading(true);

    try {
      const payload = {
        message: userMessage.text,
        ...(result?.ai_itinerary ? { itinerary_data: result.ai_itinerary } : {}),
      };

      const response = await sendAIMessage(payload);

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Failed to get AI reply:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "Sorry, something went wrong while fetching the AI reply.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[color:var(--blue-light)] text-black overflow-hidden">
      <header className="max-w-3xl w-full mx-auto p-6 pt-12 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-[rgb(var(--blue))] mb-6">
          🌍 Travel Assistant
        </h1>

        <ItineraryInputForm
          destination={destination}
          date={date}
          loading={loading}
          error={error}
          onDestinationChange={setDestination}
          onDateChange={setDate}
          onSubmit={handleSubmitSearch}
        />

        {result && <GeneratedItinerary result={result} />}
      </header>

      <ChatSection
        messages={messages}
        inputMessage={inputMessage}
        loading={loading}
        onChangeMessage={setInputMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
