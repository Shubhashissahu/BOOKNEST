import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const infoCards = [
    {
      icon: <LocationOnIcon />,
      title: "Visit Our Store",
      lines: [
        "123 Literary Lane",
        "BookNest Plaza, Floor 2",
        "London, UK SW1A 1AA",
      ],
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      lines: ["+44 (0) 20 7946 0958", "Toll Free: 0800 123 4567"],
    },
    {
      icon: <EmailIcon />,
      title: "Email Us",
      lines: ["hello@booknest.com", "support@booknest.com"],
    },
    {
      icon: <AccessTimeIcon />,
      title: "Store Hours",
      lines: [
        "Mon–Fri: 9:00 AM – 8:00 PM",
        "Sat: 10:00 AM – 6:00 PM",
        "Sun: 11:00 AM – 5:00 PM",
      ],
    },
  ];

  return (
    <Box sx={{ background: "#050505", color: "white", py: 10 }}>
      {/* WIDER container */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 4 }}>
        {/* HEADER */}
        <Box textAlign="center" mb={8}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1,
              borderRadius: 20,
              border: "1px solid rgba(255,165,0,0.4)",
              background: "rgba(255,165,0,0.1)",
              mb: 3,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <Typography fontSize={14}>Get In Touch</Typography>
          </Box>

          <Typography variant="h3" fontWeight={600} mb={2}>
            We'd Love to Hear From You
          </Typography>

          <Typography
            sx={{ color: "rgba(255,255,255,0.65)", maxWidth: 720, mx: "auto" }}
          >
            Have a question about our books or need assistance? Our dedicated team
            is here to help you find your next great read.
          </Typography>
        </Box>

        {/* MAIN LAYOUT – TRUE 2 COLUMNS */}
        <Grid container spacing={6}>
          {/* LEFT COLUMN – INFO CARDS */}
          <Grid item xs={12} md={5}>
            <Box>
              {infoCards.map((item, i) => (
                <Card
                  key={i}
                  sx={{
                    mb: 3,
                    background: "#0b1220",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        minWidth: 56,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg,#ff9800,#ffc107)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600} mb={1}>
                        {item.title}
                      </Typography>
                      {item.lines.map((line, idx) => (
                        <Typography
                          key={idx}
                          fontSize={14}
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {line}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* RIGHT COLUMN – FORM */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                width: "100%",
                height: "100%",
                background: "#0b1220",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", flex: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 4,
                      borderRadius: 2,
                      background:
                        "linear-gradient(to right,#ff9800,#ffc107)",
                    }}
                  />
                  <ChatIcon sx={{ color: "#ff9800" }} />
                </Box>

                <Typography variant="h5" fontWeight={600} mb={1}>
                  Send Us a Message
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}
                >
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </Typography>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Grid container spacing={3} sx={{ mb: 2, flex: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255,165,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#ff9800",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.6)",
                            "&.Mui-focused": {
                              color: "#ff9800",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255,165,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#ff9800",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.6)",
                            "&.Mui-focused": {
                              color: "#ff9800",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255,165,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#ff9800",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.6)",
                            "&.Mui-focused": {
                              color: "#ff9800",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        multiline
                        rows={5}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255,165,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#ff9800",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.6)",
                            "&.Mui-focused": {
                              color: "#ff9800",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    endIcon={<SendIcon />}
                    sx={{
                      mt: 2,
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 600,
                      background:
                        "linear-gradient(to right,#ff9800,#ffc107)",
                      color: "#000",
                      "&:hover": {
                        opacity: 0.95,
                      },
                      "&:disabled": {
                        background:
                          "linear-gradient(to right,#ff9800,#ffc107)",
                        color: "#000",
                        opacity: 0.7,
                      },
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <Box
                    mt={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <CheckCircleIcon sx={{ color: "#ff9800", fontSize: 18 }} />
                    <Typography fontSize={12} color="rgba(255,255,255,0.6)">
                      Your privacy is protected. We never share your information.
                    </Typography>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
