'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Avatar, Button, Grid } from "@mui/material";
import CardBoard from "../components/CardBoard/CardBoard";
import avatarAlt from "@/utils/avatarAlt";
import DashboardIcon from "@mui/icons-material/dashboard";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useWorkspace from "@/services/queries/useWorkspace";
import useRecentBoards from "@/services/queries/useRecentBoards";

const Home: NextPage = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const workspace = [{ title: "Zero", favorite: false }, { title: "My Workspace", favorite: true }, { title: "Our Workspace", favorite: false }];
  const { data: dataWorkspace } = useWorkspace();
  const { data: dataBoards } = useRecentBoards();
  return (
    <PrivateRoute>
      <Stack spacing={4.5}>
        <Grid
          alignItems="center"
          padding={2}
        >
          <Grid item xs={12}>
            <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={0.5} >
              <AccessTimeIcon sx={{ height: 24, width: 24 }}
              />
              <Typography fontSize={20} fontWeight="bold">
                Recently viewed
              </Typography>
            </Stack>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap={1}
            >
              {dataBoards && dataBoards.map((dat, idx) => {
                return <CardBoard key={String(idx)} namaCard={dat.board_title} isFavorite={Boolean(dat.is_starred)} />
              })}
            </Box>
          </Grid>
          <Grid item xs={12} mt={4}>
            <Typography fontSize={20} fontWeight="bold">
              YOUR WORKSPACES
            </Typography>
            <Stack gap={4}>
              {dataWorkspace && dataWorkspace.map((dat, idx) => {
                return (
                  <Stack key={String(idx)}>
                    <Stack flexDirection={isPhoneScreen ? 'column' : 'row'} justifyContent={'space-between'} gap={1} paddingY={1} alignItems={isPhoneScreen ? 'flex-start' : 'center'}>
                      <Stack flexDirection={'row'} gap={1} alignItems={"center"}>
                        <Avatar
                          sx={{
                            backgroundColor: "#7C8883",
                            width: 36,
                            height: 36,
                            color: "white"
                          }}
                          alt={dat.workspace_name}
                          variant="rounded"
                        >{avatarAlt(dat.workspace_name)}
                        </Avatar>
                        <Typography
                          fontWeight={"600"}
                        >
                          {dat.workspace_name}
                        </Typography>
                      </Stack>
                      <Stack flexDirection={'row'} justifyContent={'flex-end'} gap={1} height={35}>
                        <Button sx={{ fontSize: 12 }} variant="contained" startIcon={
                          <DashboardIcon sx={{ height: 16, width: 16 }}
                          />}>
                          Boards
                        </Button>
                        <Button sx={{ fontSize: 12 }} variant="contained" startIcon={
                          <PeopleIcon sx={{ height: 16, width: 16 }}
                          />}>
                          Members(12)
                        </Button>
                        <Button sx={{ fontSize: 12 }} variant="contained" startIcon={
                          <SettingsIcon sx={{ height: 16, width: 16 }}
                          />}>
                          Settings
                        </Button>
                      </Stack>
                    </Stack>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                      gap={1}
                    >
                      {workspace.map((dat, idx) => {
                        return <CardBoard key={String(idx)} namaCard={dat.title} isFavorite={dat.favorite} />
                      })}
                    </Box>
                  </Stack>
                )
              })}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </PrivateRoute>
  );
};

export default Home;
