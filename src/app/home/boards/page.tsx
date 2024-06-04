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

const Board: NextPage = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const { setIsOpenModalBoard } = useModal();
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

  return (
    <PrivateRoute>
      <Stack spacing={4.5}>
        <Grid
          alignItems="center"
          padding={2}
        >

          {dataBoards &&
            <Grid item xs={12} mb={4}>
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={0.5} >
                <AccessTimeIcon sx={{ height: 24, width: 24 }}
                />
                <Typography fontSize={20} fontWeight="bold">
                  Your boards
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

        </Grid>
      </Stack>
    </PrivateRoute>
  );
};

export default Board;
