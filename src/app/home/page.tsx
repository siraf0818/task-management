'use client'
import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import Link from "@/app/Link";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useAuth } from "@/context/authContext";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
import PrivateRoute from "@/routes/PrivateRoute";
import LoadingButton from "@mui/lab/LoadingButton";
import { Logout } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

const Home: NextPage = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const thisYear = new Date().getFullYear();

  const [isOpenModalLogout, setIsOpenModalLogout] = React.useState(false);
  const { logout, isLoading } = useAuth();

  const handleKeluar = () => {
    logout();
    closeModalLogout();
  };

  const openModalLogout = () => setIsOpenModalLogout(true);
  const closeModalLogout = () => setIsOpenModalLogout(false);

  return (
    <PrivateRoute>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh", backgroundColor: "#FFF" }}
      >
        <Box
          display={isTabletScreen ? "flex" : "grid"}
          gridTemplateColumns={isTabletScreen ? undefined : "1fr 1fr"}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={8}
          padding={isTabletScreen ? 3 : undefined}
          sx={{ backgroundColor: "#FFF" }}
        >
          <Stack
            alignItems={"flex-start"}
            padding={isTabletScreen ? undefined : 3}
          >
            <Typography
              marginTop={3}
              marginBottom={4.5}
              variant="h4"
              component="div"
              textAlign="center"
              fontWeight="bold"
            >
              You Are In{" "}
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#45A779" }}
                display="inline"
              >
                Folks
              </Typography>
            </Typography>
            <Button
              disableElevation
              size="large"
              variant="contained"
              color="error"
              onClick={openModalLogout}
              startIcon={<Logout />}
            >
              Keluar
            </Button>

          </Stack>
          {isTabletScreen ? null : (
            <Box>
              {/* <Image
                src="/images/IlustrasiMainMenu.png"
                width={540}
                height={650}
                layout="responsive"
                objectFit="contain"
                alt="Ilustrasi Main"
              /> */}
              <Typography
                variant="caption"
                component="div"
                sx={{ fontSize: 16, color: "#7C8883" }}
                textAlign="center"
              >
                {`© ${thisYear}. All right reserved`}
              </Typography>
            </Box>
          )}
        </Box>
        <Dialog
          maxWidth="xs"
          fullWidth={true}
          open={isOpenModalLogout}
          onClose={closeModalLogout}
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: "960px",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            padding={4.5}
          >
            <DialogTitle
              sx={{ padding: 0 }}
              fontSize={32}
              fontWeight={700}
            >
              Konfirmasi Keluar
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={closeModalLogout}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <DialogContent
            sx={{
              borderTop:
                "1px solid var(--text-primary-thin, #A8B4AF)",
              paddingTop: 4.5,
              paddingX: 4.5,
            }}
          >
            <Typography color={"#464E4B"}>
              Anda yakin ingin keluar dari akun dan kembali ke halaman
              masuk?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ paddingX: 4.5, paddingBottom: 4.5, paddingTop: 3 }}
          >
            <Button
              variant="outlined"
              onClick={closeModalLogout}
              color="primary"
              sx={{
                fontWeight: "bold",
              }}
            >
              Kembali
            </Button>
            <Button
              variant="contained"
              onClick={handleKeluar}
              color="error"
              sx={{
                fontWeight: "bold",
              }}
              style={{ marginLeft: 16 }}
            >
              Konfirmasi Keluar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PrivateRoute>
  );
};

export default Home;
