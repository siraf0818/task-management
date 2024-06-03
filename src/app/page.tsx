'use client'
import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
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
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import PublicRoute from "@/routes/PublicRoute";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "next/link";

interface ILoginInputs {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required("Kolom wajib diisi"),
    password: yup.string().required("Kolom wajib diisi"),
  })
  .required();

const Login: NextPage = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const { login, isLoading } = useAuth();
  const [saveEmail, setSaveEmail] = React.useState(false);
  const [initEmail, setInitEmail] = React.useState<string | null>();
  const [showPassword, setShowPassword] = React.useState(false);
  const thisYear = new Date().getFullYear();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const initialValues = React.useMemo(
    () => ({
      email: initEmail ?? "",
      password: "",
    }),
    [initEmail],
  );

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ILoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const watchEmail = watch("email");

  const handleSaveEmail = (checked: boolean) => {
    if (checked) {
      setSaveEmail(true);
    } else {
      setSaveEmail(false);
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem("email")) {
      setSaveEmail(true);
    } else {
      setSaveEmail(false);
    }
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem("email")) {
      reset({ email: localStorage.getItem("email") ?? "", password: "" });
    } else {
      setInitEmail("");
    }
  }, [reset]);

  const onSubmit = (data: ILoginInputs) => {
    login(data);
    if (saveEmail) {
      localStorage.setItem("email", watchEmail);
    } else {
      localStorage.removeItem("email");
    }
  };

  return (
    <PublicRoute>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Box
          display={isTabletScreen ? "flex" : "grid"}
          gridTemplateColumns={isTabletScreen ? undefined : "1fr 1fr"}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={8}
          padding={isTabletScreen ? 3 : undefined}
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
              Welcome{" "}
            </Typography>
            <form
              style={{
                width: "100%",
                maxWidth: "580px",
                minWidth: "200px",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Email
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                      >
                        <OutlinedInput
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="email@gmail.com"
                          size="medium"
                          sx={{ borderRadius: 2, borderColor: 'primary.main', borderWidth: 1 }}
                          {...field}
                        />
                        {errors.email && (
                          <FormHelperText>
                            {errors.email
                              ? errors.email
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{ required: "Email required" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Kata Sandi
                  </Typography>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                      >
                        <OutlinedInput
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          sx={{ borderRadius: 2 }}
                          autoComplete="password"
                          placeholder="Min 8 character"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={
                                  handleClickShowPassword
                                }
                                edge="end"
                                sx={{
                                  color: "#A8B4AF",
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          size="medium"
                          {...field}
                        />
                        {errors.password && (
                          <FormHelperText>
                            {errors.password
                              ? errors.password
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{
                      required: "Passwors required",
                    }}
                  />
                </Grid>
              </Grid>
              <Box
                width="100%"
                display="flex"
                justifyContent="flex-start"
                marginTop={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveEmail}
                      onChange={(_, checked) => {
                        handleSaveEmail(checked);
                      }}
                    />
                  }
                  label="Simpan Informasi Login"
                  sx={{
                    color: "#464E4B",
                    fontWeight: 400,
                  }}
                />
              </Box>
              <Button
                disableElevation
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  textTransform: "none",
                  marginTop: 3.5,
                }}
              >
                Login
              </Button>
              <Button
                href="/register"
                disableElevation
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  marginTop: 3.5,
                }}
              >
                Register
              </Button>
            </form>
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
      </Box>
      {/* <LoadingOverlay open={isLoading} /> */}
    </PublicRoute>
  );
};

export default Login;
