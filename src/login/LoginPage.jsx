import { Box, Button, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const handleLogin = () => {
        window.open(`${baseUrl}/auth/google`);
    };

    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ backgroundColor: '#f5f5f5' }}
        >
            <Typography variant="h4" mb={2}>
                Welcome to the Smart Meeting Scheduler
            </Typography>

            <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleLogin}
                sx={{ textTransform: 'none', backgroundColor: '#4285F4' }}
            >
                Sign in with Google
            </Button>
        </Box>
    );
};

export default LoginPage;
