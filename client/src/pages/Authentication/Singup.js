import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, LinearProgress, Slide, Snackbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import image1 from "../../assets/image1.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SingUp() {
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  // for toast notification
  const [snackBarStatus, setSnackBarStatus] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });

  const {open,vertical,horizontal, message} = snackBarStatus

  const TransitionBottom=(props)=>{
    return <Slide {...props} direction="top"/>
     }
     const handleClick = (newState) => {
       setSnackBarStatus({ ...newState, open: true });
     };
     const handleClose = () => {
       setSnackBarStatus({ ...snackBarStatus, open: false });
     };


  // use Navigate
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setLoading(true);

    e.preventDefault();
    // checking emial
    const emailCheck = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    // password checking
    const checkingPass = /^[A-Za-z]\w{7,14}$/;
    if (!input.email.match(emailCheck)) {
      alert(`Invalid email format: ${input.email}`);
      return;
    }
    if (!input.password.match(checkingPass)) {
      alert(`Password must contain at least one capital letter and one number`);
      return;
    }
    try {
      const { data } = await axios.post("/api/v1/user/", {
        userName: input.userName,
        email: input.email,
        password: input.password,
        confirmPassword: input.confirmPassword,
      });
      console.log(data);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: data.message
      });
      setLoading(false);
      if (data.success) {
        setSnackBarStatus({
          open: true,
          vertical: "top",
          horizontal: "center",
          message: `Register SuccessFul`
        });
        setTimeout(()=>{
          navigate("/login");
        },2000)
      }
    } catch (error) {
      console.log(error, `i am error`);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: `some thing went wrong`
      });
      setLoading(false);
    }
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar
      open={open}
      message={message}
      anchorOrigin={{vertical,horizontal}}
      autoHideDuration={2000}
      key={vertical + horizontal}
      onClose={handleClose}
      TransitionComponent={TransitionBottom}
      />
      {loading ? <LinearProgress variant="query" /> : ""}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${image1})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
          <Box
            sx={{
              mx: 4,
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              SingIn
            </Typography>
            <Box component="form" onSubmit={submitHandler}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="email"
                onChange={handleChangeInput}
                value={input.userName}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChangeInput}
                value={input.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Password"
                name="password"
                autoComplete="password"
                onChange={handleChangeInput}
                value={input.password}
                type="password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                onChange={handleChangeInput}
                value={input.confirmPassword}
                id="password"
                autoComplete="current-password"
              />
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Sign In
                </Button>
              )}
              <Grid container>
                <Grid item>
                  <Link to={"/login"}>{"you have an account?login"}</Link>
                  {/* <Link href="#" variant="body2">
                  </Link> */}
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
