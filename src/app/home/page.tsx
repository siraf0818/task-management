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
import avatarAlt from "@/utils/avatarAlt";
import DashboardIcon from "@mui/icons-material/dashboard";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useWorkspace from "@/services/queries/useWorkspace";
import useRecentBoards from "@/services/queries/useRecentBoards";
import useStarredBoards from "@/services/queries/useStarredBoards";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCallback } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useModal } from "@/context/modalContext";
import CardBoard from "@/app/components/CardBoard/CardBoard";
import CardCreateBoard from "@/app/components/CardCreateBoard/CardCreateBoard";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

const Home: NextPage = () => {
  const theme = useTheme();
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const { setIsOpenModalBoard, isFetchingItems, cancelFetchingItems, setWorksId } = useModal();
  const { setWorkspaceId } = useAuth();
  const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspace();
  const { data: dataBoards, refetch: refetchBoards } = useRecentBoards();
  const { data: dataStarred, refetch: refetchStarred } = useStarredBoards();

  const handleErrorResponse = useCallback((error: any) => {
    if (defaultAxios.isAxiosError(error)) {
      const serverError = error as AxiosError<any>;
      if (serverError && serverError.response) {
        console.log(`serverError`, serverError.response);
        if (serverError.response!.status === 400) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `${serverError.response.data.data.errors.message}`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.data}`, [
            { text: "OK" },
          ]);
        }

        if (serverError.response!.status === 422) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `Ada error validasi`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.message}`, [
            { text: "OK" },
          ]);
        }

        if (serverError.response!.status === 403) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `${serverError.response.data.message}`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.data}`, [
            { text: "OK" },
          ]);
        }
      } else {
        console.log("", `Something's Wrong! Silahkan coba lagi.`, [
          { text: "OK" },
        ]);
      }
    }
  }, []);

  const refetch = useCallback(
    async () => {
      try {
        refetchWorkspace();
        refetchBoards();
        refetchStarred();
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchBoards, refetchStarred, refetchWorkspace],
  );

  React.useEffect(() => {
    if (isFetchingItems) {
      refetch();
      cancelFetchingItems();
    }
  }, [cancelFetchingItems, isFetchingItems, refetch]);

  const handleExpand = (param: number) => {
    setWorkspaceId(param);
  };

  return (
    <PrivateRoute>
      <Stack spacing={4.5}>
        <Grid
          alignItems="center"
          padding={2}
        >
          {dataStarred &&
            <Grid item xs={12} mb={4}>
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={0.5} >
                <FavoriteBorderIcon sx={{ height: 24, width: 24 }}
                />
                <Typography fontSize={20} fontWeight="bold">
                  Favorite boards
                </Typography>
              </Stack>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={1}
              >
                {dataStarred && dataStarred.map((dat, idx) => {
                  return <CardBoard key={String(idx)} id={dat.board_id} namaCard={dat.board_title} refetch={refetch} isFavorite={true} />
                })}
              </Box>
            </Grid>
          }
          {dataBoards &&
            <Grid item xs={12} mb={4}>
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
                  return <CardBoard key={String(idx)} id={dat.board_id} namaCard={dat.board_title} refetch={refetch} isFavorite={Boolean(dat.is_starred)} />
                })}
              </Box>
            </Grid>
          }
          <Grid item xs={12}>
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
                      <Stack flexDirection={'row'} width={isPhoneScreen ? '100%' : undefined} justifyContent={isPhoneScreen ? 'space-between' : 'flex-end'} gap={isPhoneScreen ? 0.8 : 1} height={35}>
                        <Button
                          fullWidth={isPhoneScreen}
                          component={Link}
                          onClick={() => handleExpand(dat.workspace_id)} href="/home/boards" sx={{ fontSize: 12 }} variant="contained" startIcon={
                            <DashboardIcon sx={{ height: 16, width: 16 }}
                            />}>
                          Boards
                        </Button>
                        <Button
                          fullWidth={isPhoneScreen}
                          component={Link}
                          onClick={() => handleExpand(dat.workspace_id)} href="/home/members"
                          sx={{ fontSize: 12 }} variant="contained" startIcon={
                            <PeopleIcon sx={{ height: 16, width: 16 }}
                            />}>
                          Members ({dat.member_count})
                        </Button>
                        {!isPhoneScreen &&
                          <Button
                            component={Link}
                            onClick={() => handleExpand(dat.workspace_id)} href="/home/settings" sx={{ fontSize: 12 }} variant="contained" startIcon={
                              <SettingsIcon sx={{ height: 16, width: 16 }}
                              />}>
                            Settings
                          </Button>}
                      </Stack>
                      {isPhoneScreen &&
                        <Stack
                          component={Link}
                          onClick={() => handleExpand(dat.workspace_id)} href="/home/settings" flexDirection={'row'} justifyContent={'flex-end'} width={'100%'} height={35}>
                          <Button fullWidth sx={{ fontSize: 12 }} variant="contained" startIcon={
                            <SettingsIcon sx={{ height: 16, width: 16 }}
                            />}>
                            Settings
                          </Button>
                        </Stack>}
                    </Stack>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                      gap={1}
                    >
                      {dat.recent_boards.map((dats, idx) => {
                        return <CardBoard key={String(idx)} id={dats.id} namaCard={dats.board_title} refetch={refetch} isFavorite={Boolean(dats.is_starred)} />
                      })}
                      <CardCreateBoard namaCard={"Create new board"} create={() => { setIsOpenModalBoard(true); setWorksId(dat.workspace_id) }} />
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
