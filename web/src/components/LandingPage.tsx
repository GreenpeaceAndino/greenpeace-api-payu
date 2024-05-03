import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";

const theme_config = createTheme({
  palette: {
    primary: {
      main: "#66CC00", // Dark green color for Greenpeace
    },
    secondary: {
      main: "#003300", // Lighter green color
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      // fontWeight: 700,
      color: "#FFFFFF",
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "2rem",
      // fontWeight: 600,
      color: "#FFFFFF",
      marginBottom: "1rem",
    },
    h3: {
      fontSize: "1.8rem",
      // fontWeight: 600,
      color: "#FFFFFF",
      marginBottom: "0.5rem",
    },
    h4: {
      fontSize: "1.5rem",
      // fontWeight: 600,
      color: "#FFFFFF",
      marginBottom: "0.5rem",
    },
    // body1: {
    //   fontSize: "1rem",
    //   color: "#333",
    //   marginBottom: "1rem",
    // },
  },
});
const LandingPage: React.FC = ({}) => {
  const [responseData, setResponseData] = useState(null);

  const makeAxiosCall = async () => {
    try {
      const response = await axios.get("http://localhost:7091/gpColombia");
      setResponseData(response.data);
    } catch (error) {
      console.error("Axios call failed:", error);
    }
  };
  return (
    <ThemeProvider theme={theme_config}>
      <CssBaseline />

      <Box
        sx={{
          flexGrow: 1,
          // backgroundImage: `url("https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        <Grid
          container
          justifyContent="space-around"
          spacing={2}
          sx={{ padding: "30px" }}
        >
          <Grid
            item
            xs={3.5}
            sx={{}}
            container
            direction="column"
            // justifyContent="space-around"
            alignItems="center"
          >
            <Grid item xs={1.5} sx={{}}>
              <Box>
                {responseData ? (
                  <Typography variant="h6">
                    {JSON.stringify(responseData)}
                  </Typography>
                ) : (
                  <Typography variant="h6">No data yet</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={1.5} sx={{}}>
              <Button
                variant="contained"
                color="primary"
                onClick={makeAxiosCall}
                sx={{ marginTop: "201px" }} // Add top margin to separate button and box
              >
                Ejecutar llamado a API interna
              </Button>
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="body2">
                  Al hacer clic en el botón, se realizará una solicitud a
                  nuestra API interna en "http://localhost:7091/gpColombia".
                  Esta API, a su vez, llamará a otra API externa en
                  "https://official-joke-api.appspot.com/jokes/random".
                  <br />
                  El resultado de esta última solicitud se mostrará en la caja
                  de texto de arriba.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
