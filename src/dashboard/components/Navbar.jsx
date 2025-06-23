import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react";

const Navbar = ({ email }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${baseUrl}/auth/userinfo?email=${encodeURIComponent(email)}`);
                const data = await response.json();
                console.log("userInfo", data);
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={600}>
                    Smart Meeting Scheduler
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1">{userInfo?.name}</Typography>
                    <Avatar alt={userInfo?.name} src={userInfo?.picture} />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar