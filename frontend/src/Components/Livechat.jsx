import React, { useState, useRef, useEffect } from "react";
import {
  Box, Typography, IconButton, Avatar, Divider,
  Paper, TextField, Chip, Tooltip
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import MinimizeIcon from "@mui/icons-material/Minimize";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const LiveChat = ({ userName = "User" }) => {

  const [chatOpen, setChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 Welcome to BookNest Support. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      avatar: "🤖"
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = [
    { label: "Track Order", icon: <AssignmentIcon sx={{ fontSize: 16 }} /> },
    { label: "Book Recommendation", icon: <FavoriteBorderIcon sx={{ fontSize: 16 }} /> },
    { label: "FAQ", icon: <HelpIcon sx={{ fontSize: 16 }} /> },
    { label: "Support Hours", icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> }
  ];

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
      avatar: "👤"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowQuickReplies(false);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: `Thanks for reaching out! I'll help you with: "${text}". One moment please...`,
        sender: "bot",
        timestamp: new Date(),
        avatar: "🤖"
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply) => handleSendMessage(reply);

  const ChatContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(180deg, #0a0a0aa8 0%, #373535 100%)" }}>
      
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #ffa500, #ff5e00)",
          color: "white",
          p: 2,
          borderRadius: "12px 12px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ChatIcon sx={{ fontSize: 22 }} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              BookNest Support
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              🟢 We're online
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton size="small" sx={{ color: "white" }} onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <ChatIcon sx={{ fontSize: 18 }} /> : <MinimizeIcon sx={{ fontSize: 18 }} />}
          </IconButton>

          <IconButton size="small" sx={{ color: "white" }} onClick={() => setChatOpen(false)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {!isMinimized && (
        <>
          {/* MESSAGES */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {messages.map((message) => (
              <Box key={message.id} sx={{ display: "flex", justifyContent: message.sender === "user" ? "flex-end" : "flex-start", gap: 1 }}>

                {message.sender === "bot" && (
                  <Avatar sx={{ width: 28, height: 28, backgroundColor: "rgba(255,165,0,0.2)" }}>
                    {message.avatar}
                  </Avatar>
                )}

                <Box sx={{ maxWidth: "75%" }}>
                  <Paper
                    sx={{
                      p: "10px 14px",
                      backgroundColor: message.sender === "user" ? "#ffa500" : "rgba(255,165,0,0.1)",
                      color: message.sender === "user" ? "#000" : "white",
                      borderRadius: message.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"
                    }}
                  >
                    {message.text}
                  </Paper>

                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </Box>

                {message.sender === "user" && (
                  <Avatar sx={{ width: 28, height: 28, backgroundColor: "#ffa500", color: "#000" }}>
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </Box>
            ))}

            {isTyping && (
              <Typography sx={{ color: "#ffa500", fontSize: 13 }}>
                🤖 typing...
              </Typography>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* QUICK REPLIES */}
          {showQuickReplies && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", mb: 1 }}>
                Quick replies:
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {quickReplies.map((reply, i) => (
                  <Chip
                    key={i}
                    icon={reply.icon}
                    label={reply.label}
                    onClick={() => handleQuickReply(reply.label)}
                    sx={{
                      backgroundColor: "rgba(255,165,0,0.15)",
                      color: "#ffa500",
                      border: "1px solid rgba(255,165,0,0.3)",
                      height: 28
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ borderColor: "rgba(255,165,0,0.1)" }} />

          {/* INPUT */}
          <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            <IconButton
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              sx={{ backgroundColor: "#ffa500", color: "#000" }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );

  if (!chatOpen) {
    return (
      <Tooltip title="Chat with us!">
        <Box
          onClick={() => setChatOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            background: "linear-gradient(135deg, #ffa500, #ff5e00)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,165,0,0.4)"
          }}
        >
          <ChatIcon sx={{ color: "white", fontSize: 32 }} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
  sx={{
    position: "fixed",
    bottom: 20,
    right: 20,
    width: { xs: "90vw", sm: 380 },
    height: isMinimized ? "auto" : 550,
    backgroundColor: "#0a0a0a",
    border: "1px solid rgba(255,165,0,0.2)",
    borderRadius: "12px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999   // ✅ fix
  }}
>
      <ChatContent />
    </Box>
  );
};

export default LiveChat;