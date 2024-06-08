'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useCallback } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useModal } from "@/context/modalContext";
import CardBoard from "@/app/components/CardBoard/CardBoard";
import CardCreateBoard from "@/app/components/CardCreateBoard/CardCreateBoard";
import useWorkspaceMembers from "@/services/queries/useWorkspaceMembers";
import { useAuth } from "@/context/authContext";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import useWorkspaceDetail from "@/services/queries/useWorkspaceDetail";
import CloseIcon from '@mui/icons-material/Close';
import Icon from '@mdi/react';
import { mdiPencil } from "@mdi/js";

const Member: NextPage = () => {
  const theme = useTheme();
  const { workspaceId } = useAuth();
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [isEdit, setIsEdit] = React.useState(false);
  const { setIsOpenModalUser, setIsOpenModalBoard, setIsOpenModalWorkspace } = useModal();
  const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspaceDetail(workspaceId);
  const { data: dataMembers, refetch: refetchMembers } = useWorkspaceMembers(workspaceId);

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
        refetchMembers();
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchMembers, refetchWorkspace],
  );

  return (
    <PrivateRoute>
      <Stack spacing={4.5}>
        <Grid
          alignItems="center"
          padding={2}
        >
          {dataWorkspace &&
            <Grid item xs={12} mb={4} py={2}>
              <Stack flexDirection={'row'} gap={1} justifyContent={"space-between"}>
                <Stack flexDirection={'row'} gap={1} alignItems={"flex-start"}>
                  <IconButton sx={{ p: 0 }} onClick={() => {
                    setIsEdit(!isEdit);
                  }}>
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
                  </IconButton>
                  <Stack>
                    <Typography
                      fontWeight={"600"}
                    >
                      {dataWorkspace.workspace_name}
                    </Typography>
                    <Typography
                    >
                      {dataWorkspace.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          }
          {isEdit &&
            <Grid item xs={12} mb={4}>
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={2} >
                <PeopleOutlineIcon sx={{ height: 32, width: 32 }}
                />
              </Stack>
              <Box
                display="grid"
                // gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={1}
              >
                {dataMembers && dataMembers.map((dat, idx) => {
                  return <Stack key={idx} p={1.5} flexDirection={'row'} flex={1} borderTop={1} borderBottom={1} borderColor={'secondary.main'} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack gap={1} flexDirection={'row'}>
                      <Avatar
                        sx={{
                          backgroundColor: "primary.main",
                          width: 46,
                          height: 46,
                          color: 'white',
                        }}
                        alt={dat?.user_username ?? "-"}
                      >
                        {avatarAlt(dat?.user_username ?? "A")}
                      </Avatar>
                      <Stack>
                        <Typography
                          fontSize={14}
                          fontWeight={500}
                          color={"#c5c5c5"}
                        >
                          {dat?.user_username ?? "-"}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontWeight={500}
                          color={"#c5c5c5"}
                        >
                          {dat?.user_email ?? "-"}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Button
                      onClick={() => console.log(dat.user_id)} sx={{ fontSize: 12, height: 35 }} variant="outlined" color="error" startIcon={
                        <CloseIcon sx={{ height: 16, width: 16 }}
                        />}>
                      Remove
                    </Button>
                  </Stack>
                })}
              </Box>
            </Grid>
          }
          <Button
            onClick={() => setIsOpenModalUser(true)} sx={{ fontSize: 12, p: 0, fontWeight: '700' }} variant="text" color="buttonred">
            Delete This Wokrspace ?
          </Button>

        </Grid>
      </Stack>
    </PrivateRoute>
  );
};

export default Member;
