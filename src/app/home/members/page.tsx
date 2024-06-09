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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import useUserData from "@/services/queries/useUserData";
import { DefaultResponse } from "@/constants/types";
import axios from "@/services/axios";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";

const Member: NextPage = () => {
  const theme = useTheme();
  const { workspaceId } = useAuth();
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [id, setId] = React.useState<number>();
  const [idKick, setIdKick] = React.useState<number>();
  const [name, setName] = React.useState<string>();
  const [role, setRole] = React.useState<string>();
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const Router = useRouter();
  const { setIsOpenModalUser, setWorksId } = useModal();
  const { data: dataUser } = useUserData();
  const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspaceDetail(workspaceId);
  const { data: dataMembers, refetch: refetchMembers } = useWorkspaceMembers(workspaceId);
  const [isOpenModalLeave, setIsOpenModalLeave] = React.useState(false);
  const openModalLeave = () => setIsOpenModalLeave(true);
  const closeModalLeave = () => setIsOpenModalLeave(false);

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

  const leave = useCallback(
    async () => {
      setLoading(true);
      try {
        const { data: dataN } = await axios.delete<DefaultResponse>(
          `workspace/${dataWorkspace?.id}/member/${idKick}/kick`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!dataN.errno) {
          Swal.fire({
            title: "Member Removed",
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
          refetch();
          closeModalLeave();
          if ((role === "owner" || id === dataUser?.user_id)) {
            Router.push("/home");
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [Router, dataUser?.user_id, dataWorkspace?.id, handleErrorResponse, id, idKick, refetch, role],
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
                <Button
                  onClick={() => { setIsOpenModalUser(true); setWorksId(workspaceId) }} sx={{ fontSize: 12, height: 35, mt: 0.5 }} variant="contained" color="buttongreen" startIcon={
                    <PersonAddAltIcon sx={{ height: 16, width: 16 }}
                    />}>
                  {isLaptopScreen ? "Invite members" : "Invite"}
                </Button>
              </Stack>
            </Grid>
          }
          {dataMembers &&
            <Grid item xs={12} mb={4}>
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5} marginBottom={2} >
                <PeopleOutlineIcon sx={{ height: 32, width: 32 }}
                />
                <Typography fontSize={20} fontWeight="bold">
                  Workspace members ({dataMembers.length})
                </Typography>
              </Stack>
              <Box
                display="grid"

              >
                {dataMembers && dataMembers.map((dat, idx) => {
                  return <Stack key={idx} p={1.5} flexDirection={'row'} flex={1} borderBottom={1} borderColor={'secondary.main'} justifyContent={'space-between'} alignItems={'center'}>
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
                    {(dataWorkspace?.user_role_on_workspace === "owner" || dat.user_id === dataUser?.user_id) &&
                      <Button
                        onClick={() => { setId(dat.user_id); setIdKick(dat.membership_id); setName(dat.user_username); setRole(dat.role_name); openModalLeave(); }} sx={{ fontSize: 12, height: 35 }} variant="outlined" color="error" startIcon={
                          <CloseIcon sx={{ height: 16, width: 16 }}
                          />}>
                        {(dat.role_name === "owner" || dat.user_id === dataUser?.user_id) ? 'Leave' : 'Remove'}
                      </Button>
                    }
                  </Stack>
                })}
              </Box>
            </Grid>
          }
        </Grid>

        <Dialog
          maxWidth="xs"
          fullWidth={true}
          fullScreen={isPhoneScreen}
          open={isOpenModalLeave}
          onClose={closeModalLeave}
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
              {(role === "owner" || id === dataUser?.user_id) ? "Leave" : "Remove"}
            </DialogTitle>
            {!isPhoneScreen &&
              <IconButton
                aria-label="close"
                onClick={closeModalLeave}
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
              Are you sure you want to
              {(role === "owner" || id === dataUser?.user_id) ? " leave" : ` remove ${name}`} from this workspace?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ paddingX: isPhoneScreen ? 2.5 : 4.5, paddingBottom: isPhoneScreen ? 2.5 : 4.5, paddingTop: 3, flexDirection: isPhoneScreen ? 'column' : 'row' }}
          >
            {isPhoneScreen &&
              <LoadingButton
                loading={isLoading}
                fullWidth={isPhoneScreen}
                variant="outlined"
                onClick={closeModalLeave}
                color="primary"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Cancel
              </LoadingButton>}
            <LoadingButton
              loading={isLoading}
              fullWidth={isPhoneScreen}
              variant="contained"
              onClick={leave}
              color="error"
              sx={{
                fontWeight: "bold",
                marginLeft: isPhoneScreen ? 0 : 16,
                marginTop: isPhoneScreen ? 2 : 0,
              }}
            >
              {(role === "owner" || id === dataUser?.user_id) ? "Leave" : "Remove"}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Stack>
    </PrivateRoute>
  );
};

export default Member;
