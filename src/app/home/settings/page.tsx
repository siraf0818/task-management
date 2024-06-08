'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useCallback, useState } from "react";
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
import { DefaultResponse } from "@/constants/types";
import axios from "@/services/axios";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";

const Member: NextPage = () => {
  const [isOpenModalDelete, setIsOpenModalDelete] = React.useState(false);
  const Router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const { workspaceId } = useAuth();
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [isEdit, setIsEdit] = React.useState(false);
  const { setIsOpenModalUser, setIsOpenModalBoard, setIsOpenModalWorkspace } = useModal();
  const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspaceDetail(workspaceId);
  const openModalDelete = () => setIsOpenModalDelete(true);
  const closeModalDelete = () => setIsOpenModalDelete(false);

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
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchWorkspace],
  );

  const deleteWorkpsace = useCallback(
    async () => {
      setLoading(true);
      try {
        const { data } = await axios.delete<DefaultResponse>(
          `workspace/${workspaceId}`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        console.log('data', data)
        if (!data.errno) {
          Swal.fire({
            title: "Workspace Deleted",
            position: "top-end",
            showConfirmButton: false,
            icon: "success",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showCloseButton: true,
            customClass: {
              container: "my-swal",
            },
          });
          Router.push("/home");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [Router, handleErrorResponse, workspaceId],
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

              </Box>
            </Grid>
          }
          <Button
            onClick={openModalDelete} sx={{ fontSize: 12, px: 1, py: 1, fontWeight: '700' }} variant="text" color="buttonred">
            Delete This Wokrspace ?
          </Button>
        </Grid>
        <Dialog
          maxWidth="xs"
          fullWidth={true}
          fullScreen={isPhoneScreen}
          open={isOpenModalDelete}
          onClose={closeModalDelete}
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
            padding={isPhoneScreen ? 2.5 : 4.5}
          >
            <DialogTitle
              sx={{ padding: 0 }}
              fontSize={32}
              fontWeight={700}
            >
              Delete
            </DialogTitle>
            {!isPhoneScreen &&
              <IconButton
                aria-label="close"
                onClick={closeModalDelete}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>}
          </Stack>
          <DialogContent
            sx={{
              borderTop:
                "1px solid var(--text-primary-thin, #A8B4AF)",
              paddingTop: isPhoneScreen ? 2.5 : 4.5,
              paddingX: isPhoneScreen ? 2.5 : 4.5,
            }}
          >
            <Typography>
              Are you sure want to delete this workspace permanently?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ paddingX: isPhoneScreen ? 2.5 : 4.5, paddingBottom: isPhoneScreen ? 2.5 : 4.5, paddingTop: 3, flexDirection: isPhoneScreen ? 'column' : 'row' }}
          >
            {isPhoneScreen &&
              <Button
                fullWidth={isPhoneScreen}
                variant="outlined"
                onClick={closeModalDelete}
                color="primary"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>}
            <LoadingButton
              loading={isLoading}
              fullWidth={isPhoneScreen}
              variant="contained"
              onClick={deleteWorkpsace}
              color="error"
              sx={{
                fontWeight: "bold",
                marginLeft: isPhoneScreen ? 0 : 16,
                marginTop: isPhoneScreen ? 2 : 0,
              }}
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Stack>
    </PrivateRoute>
  );
};

export default Member;
