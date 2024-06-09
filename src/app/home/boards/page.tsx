'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Avatar, Grid } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useCallback } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useModal } from "@/context/modalContext";
import CardBoard from "@/app/components/CardBoard/CardBoard";
import CardCreateBoard from "@/app/components/CardCreateBoard/CardCreateBoard";
import useWorkspaceBoards from "@/services/queries/useWorkspaceBoards";
import { useAuth } from "@/context/authContext";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import useWorkspaceDetail from "@/services/queries/useWorkspaceDetail";
import { useRouter } from "next/navigation";

const Board: NextPage = () => {
  const theme = useTheme();
  const Router = useRouter();
  const { workspaceId, setBoardId, setWorkspaceId } = useAuth();
  const { setIsOpenModalBoard, isFetchingItems, cancelFetchingItems, setWorksId } = useModal();
  const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspaceDetail(workspaceId);
  const { data: dataBoards, refetch: refetchBoards } = useWorkspaceBoards(workspaceId);

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
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchBoards, refetchWorkspace],
  );

  React.useEffect(() => {
    if (isFetchingItems) {
      refetch();
      cancelFetchingItems();
    }
  }, [cancelFetchingItems, isFetchingItems, refetch]);

  return (
    <PrivateRoute>
      <Stack spacing={4.5}>
        <Grid
          alignItems="center"
          padding={2}
        >
          {dataWorkspace &&
            <Grid item xs={12} mb={4} borderBottom={0.5} py={2} borderColor={'secondary.main'}>
              <Stack flexDirection={'row'} gap={1} alignItems={"flex-start"}>
                <Avatar
                  sx={{
                    backgroundColor: "#7C8883",
                    width: 56,
                    height: 56,
                    color: "white"
                  }}
                  sizes="large"
                  alt={dataWorkspace.workspace_name}
                  variant="rounded"
                >
                  <Typography fontSize={36}>
                    {avatarAlt(dataWorkspace.workspace_name)}
                  </Typography>
                </Avatar>
                <Stack whiteSpace={'normal'}>
                  <Typography
                    fontWeight={"600"}
                  >
                    {dataWorkspace.workspace_name}
                  </Typography>
                  <Typography sx={{
                    whiteSpace: 'normal'
                  }}
                  >
                    {dataWorkspace.description}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          }
          {dataBoards &&
            <Grid item xs={12} mb={4}>
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={0.5} >
                <PersonOutlineIcon sx={{ height: 24, width: 24 }}
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
                  return <CardBoard click={() => {
                    setBoardId(dat.board_id); setWorkspaceId(dat.workspace_id);
                    Router.push("/home/lists");
                  }} key={String(idx)} id={dat.board_id} namaCard={dat.board_title} refetch={refetch} isFavorite={Boolean(dat.is_starred)} />
                })}
                <CardCreateBoard namaCard={"Create new board"} create={() => { setIsOpenModalBoard(true); setWorksId(workspaceId) }} />
              </Box>
            </Grid>
          }

        </Grid>
      </Stack>
    </PrivateRoute>
  );
};

export default Board;
