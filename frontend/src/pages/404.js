import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
export default function Custom404() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#000",
                color: "#fff",
                textAlign: "center",
                px: 2,
            }}
        >
            <Typography variant="h1" component="h1" sx={{ fontWeight: 700, fontSize: "6rem", mb: 2 }}>
                404
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
                This page could not be found.
            </Typography>
            <Link href="/home" passHref legacyBehavior>
                <Button variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600 }}>
                    Go back home
                </Button>
            </Link>
        </Box>
    );
}
