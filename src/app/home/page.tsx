'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";

const Home: NextPage = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const thisYear = new Date().getFullYear();

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
    </PrivateRoute>
  );
};

export default Home;
