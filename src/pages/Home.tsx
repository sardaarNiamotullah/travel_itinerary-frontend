import { useState } from "react";
import { motion } from "framer-motion";

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
  const [hasSubmitted, setHasSubmitted] = useState(false); // NEW

  const handleSubmitSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchItinerary(destination, date);
      setResult(data);
      setHasSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Transform specific backend errors to user-friendly messages
        if (
          err.message.includes("Place ID") &&
          err.message.includes("does not exist")
        ) {
          setError("Please enter a valid city name.");
        } else {
          // Fallback to original message for other errors
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred.");
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
    setLoading(true);

    try {
      const payload = {
        message: userMessage.text,
        ...(result?.ai_itinerary
          ? { itinerary_data: result.ai_itinerary }
          : {}),
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
      {/* Initial Form View */}
      {!hasSubmitted && (
        <div className="flex flex-col items-center justify-center h-full">
          <ItineraryInputForm
            destination={destination}
            date={date}
            loading={loading}
            error={error}
            onDestinationChange={setDestination}
            onDateChange={setDate}
            onSubmit={handleSubmitSearch}
          />
        </div>
      )}

      {hasSubmitted && result && (
        <>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-3xl w-full mx-auto px-6 pt-6 pb-2 h-[60%]"
          >
            <GeneratedItinerary result={result} />
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="flex-1 h-[40%]"
          >
            <ChatSection
              messages={messages}
              inputMessage={inputMessage}
              loading={loading}
              onChangeMessage={setInputMessage}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
