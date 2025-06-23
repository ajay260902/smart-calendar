import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const Loader = ({ open, message = "Loading..." }) => {
    return (
        <Backdrop
            open={open}
            sx={{
                color: "#fff",
                zIndex:99999,
                flexDirection: "column",
            }}
        >
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        </Backdrop>
    );
};

export default Loader;