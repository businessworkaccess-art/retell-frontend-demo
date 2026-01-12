"use client";

import React, { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { Phone, PhoneOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const retellWebClient = new RetellWebClient();

export default function RetellDemo() {
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "active" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID || "";
  const isConfigured = !!process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

  useEffect(() => {
    // Handle call events
    retellWebClient.on("call_started", () => {
      console.log("Call started");
      setCallStatus("active");
    });

    retellWebClient.on("call_ended", () => {
      console.log("Call ended");
      setCallStatus("idle");
    });

    retellWebClient.on("error", (error) => {
      console.error("Retell error:", error);
      setCallStatus("error");
      setErrorMessage(error.message || "An error occurred during the call");
    });

    return () => {
      // Cleanup
      retellWebClient.off("call_started");
      retellWebClient.off("call_ended");
      retellWebClient.off("error");
    };
  }, []);

  const toggleCall = async () => {
    if (callStatus === "active" || callStatus === "calling") {
      retellWebClient.stopCall();
      setCallStatus("idle");
      return;
    }

    setCallStatus("calling");
    setErrorMessage("");

    try {
      const response = await fetch("/api/register-call", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register call");
      }

      const data = await response.json();
      
      await retellWebClient.startCall({
        accessToken: data.access_token,
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus("error");
      setErrorMessage((error as Error).message || "Failed to start call. Check your API key and Agent ID.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {!isConfigured && (
        <div className="config-banner">
          <AlertCircle size={14} style={{ display: "inline", marginRight: "4px" }} />
          Missing NEXT_PUBLIC_RETELL_AGENT_ID in environment variables
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className={`status-indicator status-${callStatus}`}>
          <div className="status-dot" />
          <span className="capitalize">{callStatus}</span>
        </div>

        <h1 className="agent-title">Retell AI Assistant</h1>
        <p className="agent-subtitle">Experience the power of ultra-realistic conversational AI</p>

        <div className="relative flex justify-center py-8">
          <AnimatePresence>
            {callStatus === "active" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="wave-container absolute"
                style={{ top: "0" }}
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="wave-bar" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleCall}
            disabled={callStatus === "calling"}
            className={`call-button ${
              callStatus === "active" ? "call-button-active" : "call-button-idle"
            }`}
          >
            {callStatus === "active" ? (
              <PhoneOff size={32} />
            ) : (
              <Phone size={32} />
            )}
          </button>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="transcript-container">
          <p style={{ color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>
            {callStatus === "active" ? "Live Voice Session" : "Ready to start?"}
          </p>
          <p style={{ fontSize: "13px", lineHeight: "1.5" }}>
            {callStatus === "active" 
              ? "Speech recognition is active. Go ahead and say something!" 
              : "Click the phone button to begin a voice conversation with your Retell agent."}
          </p>
        </div>
      </motion.div>

      <div style={{ position: "fixed", bottom: "24px", left: "24px", opacity: 0.5, fontSize: "12px" }}>
        Agent ID: {agentId || "Not Set"}
      </div>
    </main>
  );
}
