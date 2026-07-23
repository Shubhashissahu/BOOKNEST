import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.2)",
    },
    "&:hover fieldset": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9800",
    },
  },

  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.6)",
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const infoCards = [
  {
    icon:<LocationOnIcon/>,
    title:"Visit Our Store",
    lines:[
      "123 Literary Lane",
      "BookNest Plaza, Floor 2",
      "Bhubaneswar"
    ]
  },
  {
    icon:<PhoneIcon/>,
    title:"Call Us",
    lines:[
      "+44 (0) 20 7946 0958",
      "Toll Free: 0800 123 4567"
    ]
  },
  {
    icon:<EmailIcon/>,
    title:"Email Us",
    lines:[
      "hello@booknest.com",
      "support@booknest.com"
    ]
  },
  {
    icon:<AccessTimeIcon/>,
    title:"Store Hours",
    lines:[
      "Mon–Fri: 9:00 AM – 8:00 PM",
      "Sat: 10:00 AM – 6:00 PM",
      "Sun: 11:00 AM – 5:00 PM"
    ]
  }
];
export default function ContactPage() {
  const [formData,setFormData]=useState({
    name:"",
    email:"",
    subject:"",
    message:""
  });

  const [errors,setErrors]=useState({});
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [toast,setToast]=useState({
    open:false,
    message:"",
    severity:"success"
  });

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
    if(errors[name]) setErrors({...errors,[name]:""});
  };

  const validate=()=>{
    let err={};
    if(!formData.name.trim()) err.name="Name is required";
    if(!formData.email.trim()) err.email="Email is required";
    else if(!EMAIL_REGEX.test(formData.email)) err.email="Enter a valid email";
    if(!formData.subject.trim()) err.subject="Subject is required";
    if(!formData.message.trim()) err.message="Message is required";
    setErrors(err);
    return Object.keys(err).length===0;
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!validate()) return;

    setIsSubmitting(true);

    setTimeout(()=>{
      setToast({
        open:true,
        message:"Message sent successfully!",
        severity:"success"
      });

      setFormData({
        name:"",
        email:"",
        subject:"",
        message:""
      });

      setIsSubmitting(false);
    },1200);
  };

  return (
    <Box sx={{background:"#050505",color:"#fff",minHeight:"100vh",py:10}}>
      <Box sx={{maxWidth:1400,mx:"auto",px:{xs:2,md:4}}}>

        <Box textAlign="center" mb={8}>
          <Box sx={{
            display:"inline-flex",
            alignItems:"center",
            gap:1,
            px:3,
            py:1,
            borderRadius:20,
            border:"1px solid rgba(255,165,0,.4)",
            background:"rgba(255,165,0,.1)",
            mb:3
          }}>
            <AutoAwesomeIcon fontSize="small"/>
            <Typography>Get In Touch</Typography>
          </Box>

          <Typography variant="h3" fontWeight={600} mb={2}>
            We'd Love to Hear From You
          </Typography>

          <Typography sx={{maxWidth:600,mx:"auto",color:"rgba(255,255,255,.65)"}}>
            Have a question about our books or need assistance? Our dedicated team is here to help you find your next great read.
          </Typography>
        </Box>


        <Grid container spacing={4}>

          <Grid item xs={12} md={5}>
            {infoCards.map((item,i)=>(
              <Card key={i} sx={{
                mb:2.5,
                height:110,
                background:"#0b1220",
                border:"1px solid rgba(255,255,255,.1)",
                borderRadius:3
              }}>
                <CardContent sx={{
                  height:"100%",
                  display:"flex",
                  alignItems:"center",
                  gap:2
                }}>

                  <Box sx={{
                    width:56,
                    height:56,
                    borderRadius:2,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    background:"linear-gradient(135deg,#ff9800,#ffc107)"
                  }}>
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography fontWeight={600} mb={1}>
                      {item.title}
                    </Typography>

                    {item.lines.map((line,index)=>(
                      <Typography
                        key={index}
                        fontSize={14}
                        color="rgba(255,255,255,.6)"
                      >
                        {line}
                      </Typography>
                    ))}
                  </Box>

                </CardContent>
              </Card>
            ))}
          </Grid>


          <Grid item xs={12} md={7}>
            <Card sx={{
              background:"#0b1220",
              border:"1px solid rgba(255,255,255,.1)",
              borderRadius:4
            }}>

              <CardContent sx={{p:{xs:2,md:4}}}>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box sx={{
                    width:40,
                    height:4,
                    borderRadius:2,
                    background:"linear-gradient(to right,#ff9800,#ffc107)"
                  }}/>
                  <ChatIcon sx={{color:"#ff9800"}}/>
                </Box>

                <Typography variant="h5" fontWeight={600} mb={1}>
                  Send Us a Message
                </Typography>

                <Typography mb={4} color="rgba(255,255,255,.65)">
                  Fill out the form below and we'll get back to you within 24 hours.
                </Typography>


                <Box component="form" onSubmit={handleSubmit}>

                  <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        sx={inputSx}
                      />
                    </Grid>

                  </Grid>


                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    endIcon={<SendIcon/>}
                    sx={{
                      mt:3,
                      py:1.6,
                      borderRadius:3,
                      fontWeight:600,
                      background:"linear-gradient(to right,#ff9800,#ffc107)",
                      color:"#000"
                    }}
                  >
                    {isSubmitting?"Sending...":"Send Message"}
                  </Button>


                  <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={1}>
                    <CheckCircleIcon sx={{color:"#ff9800",fontSize:18}}/>
                    <Typography fontSize={12} color="rgba(255,255,255,.6)">
                      Your privacy is protected. We never share your information.
                    </Typography>
                  </Box>

                </Box>

              </CardContent>

            </Card>
          </Grid>

        </Grid>

      </Box>


      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={()=>setToast({...toast,open:false})}
      >
        <Alert severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}