import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will respond shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Box sx={{ py: 10, color: "white" }}>
      
      {/* PAGE TITLE */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 2,
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Contact Us
      </Typography>

      <Typography
        align="center"
        sx={{
          maxWidth: 650,
          mx: "auto",
          mb: 5,
          color: "rgba(255,255,255,0.65)",
          fontSize: "1.1rem",
        }}
      >
        We'd love to hear from you! Send us your questions, feedback, or support
        requests and our team will reach out shortly.
      </Typography>

      {/* CONTACT FORM CARD */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    py: 1.4,
                    borderRadius: "30px",
                    background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      opacity: 0.9,
                      transform: "translateY(-3px)",
                      transition: "0.2s",
                    },
                  }}
                >
                  Send Message
                </Button>

              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* EXTRA SPACING */}
      <Box sx={{ height: 50 }}></Box>
    </Box>
  );
}

export default ContactPage;
