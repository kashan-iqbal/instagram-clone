import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import image2 from "../../assets/image2.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, LinearProgress } from "@mui/material";
import usePositionedSnackbar from "../../hooks/useSnackBarHook";
import linkStyle from './../../utils';


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/"style={linkStyle}>
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  // Navigate
  const Navigate = useNavigate();

  // button disable
  useEffect(() => {
    const { email, password } = inputs;
    if (email && password) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [inputs]);

  // useing Hooks
  const { PositionedSnackbar, showSnackbar } = usePositionedSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // checking emial
      const emailCheck = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

      if (!inputs.email.match(emailCheck)) {
        alert(`invalid email ${inputs.email}`);
        setLoading(false);
        return;
      }
      const { data } = await axios.post("/api/v1/user/singin", {
        email: inputs.email,
        password: inputs.password,
      });
      setLoading(false);
      showSnackbar(data.message);
      if (data.success) {
        setLoading(false);
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        localStorage.setItem("name", data.userName);
        Navigate("/Home");
      } else {
        setLoading(false);
        showSnackbar(data.message);
      }
    } catch (error) {
      if (error) {
        setLoading(false);
        showSnackbar(error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <PositionedSnackbar />
      {loading ? <LinearProgress /> : ""}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${image2})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                value={inputs.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={inputs.password}
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
                  sx={{ mt: 3, mb: 2 }}
                  disabled={disable}
                >
                  Login
                </Button>
              )}

              <Grid container>
                <Grid item xs>
                  <Link to={"/forget-Password"} variant="body2" style={linkStyle} >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to={"/"} style={linkStyle}>{"Don't have an account? Sign Up"}</Link>
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
