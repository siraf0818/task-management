'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Autocomplete, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useCallback, useEffect, useState } from "react";
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
import { DefaultResponse, TWType } from "@/constants/types";
import axios from "@/services/axios";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import useWorkspaceTypes from "@/services/queries/useWorkspaceTypes";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface IUpdateWorkspace {
  name: string;
  type_id: TWType;
  description?: string;
}

const schemaUpdateWorkspace = yup
  .object({
    name: yup
      .string()
      .required("Required"),
    type_id: yup.object().shape({
      id: yup.number().required("Required"),
      name: yup.string().required("Required"),
    }).required("Required"),
    description: yup
      .string(),
  })
  .required();

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
  const { data: dataWTypes } = useWorkspaceTypes();

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

  const initialValuesUpdateWorkspace = React.useMemo(
    () => ({
      name: dataWorkspace?.workspace_name,
      type_id: { id: dataWorkspace?.type_id, name: dataWorkspace?.type_name },
      description: dataWorkspace?.description,
    }),
    [dataWorkspace?.description, dataWorkspace?.type_id, dataWorkspace?.type_name, dataWorkspace?.workspace_name],
  );

  const {
    handleSubmit: handleSubmitUpdateWorkspace,
    formState: { errors: errorsUpdateWorkspace },
    control: controlUpdateWorkspace,
    reset: resetUpdateWorkspace,
  } = useForm<IUpdateWorkspace>({
    resolver: yupResolver(schemaUpdateWorkspace),
    defaultValues: initialValuesUpdateWorkspace,
  });

  const updateWorkspace = useCallback(
    async (values: IUpdateWorkspace) => {
      setLoading(true);
      try {
        const { data: dataN } = await axios.put<DefaultResponse>(
          `workspace/${dataWorkspace?.id}/name`, {
          name: values.name,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        const { data: dataT } = await axios.put<DefaultResponse>(
          `workspace/${dataWorkspace?.id}/type`, {
          type_id: values.type_id.id,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        const { data: dataD } = await axios.put<DefaultResponse>(
          `workspace/${dataWorkspace?.id}/description`, {
          description: values.description,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!dataN.errno || !dataT.errno || !dataD.errno) {
          Swal.fire({
            title: "Workspace Updated",
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
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [dataWorkspace?.id, handleErrorResponse, refetch],
  );

  const onSubmitUpdateWorkspace = (data: IUpdateWorkspace) => {
    updateWorkspace(data);
  };

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

  useEffect(() => {
    if (dataWorkspace) {
      resetUpdateWorkspace(initialValuesUpdateWorkspace);
    }
  }, [dataWorkspace, initialValuesUpdateWorkspace, resetUpdateWorkspace]);

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
          <Grid item xs={12} mb={4}>
            <Stack flexDirection={"column"} gap={1.5}>
              <Stack flexDirection={"column"} gap={0.5}>
                <Typography
                  fontWeight={500}

                >
                  Workspace name
                </Typography>
                <Controller
                  control={controlUpdateWorkspace}
                  name="name"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="name"
                      size="medium"
                      error={Boolean(errorsUpdateWorkspace.name)}
                      helperText={
                        errorsUpdateWorkspace.name
                          ? errorsUpdateWorkspace.name.message
                          : ""
                      }
                    />
                  )}
                />
              </Stack>
              <Stack flexDirection={"column"} gap={0.5}>
                <Typography
                  fontWeight={500}

                >
                  Workspace type
                </Typography>
                <Controller
                  control={controlUpdateWorkspace}
                  name="type_id"
                  render={({
                    field: { onChange, value },
                  }) => (
                    <Autocomplete
                      fullWidth
                      size="medium"
                      disablePortal
                      value={value}
                      id="type_id"
                      options={dataWTypes ?? []}
                      onChange={(_event, newType: any,) => {
                        onChange(newType);
                      }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params}
                        error={Boolean(errorsUpdateWorkspace.type_id)}
                        helperText={
                          errorsUpdateWorkspace.type_id && errorsUpdateWorkspace.type_id.id
                            ? errorsUpdateWorkspace.type_id.id.message
                            : ""
                        } />
                      }
                    />
                  )}
                />
              </Stack>
              <Stack flexDirection={"column"} gap={0.5}>
                <Typography
                  fontWeight={500}

                >
                  Workspace description{" "}
                  <Typography
                    fontWeight={500}
                    display={"inline"}
                    color="#7C8883"
                  >
                    (optional)
                  </Typography>
                </Typography>
                <Controller
                  control={controlUpdateWorkspace}
                  name="description"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      size="medium"
                      id="description"
                      error={Boolean(errorsUpdateWorkspace.description)}
                      helperText={
                        errorsUpdateWorkspace.description
                          ? errorsUpdateWorkspace.description.message
                          : ""
                      }
                      {...field}
                    />)}
                />
              </Stack>
              <LoadingButton
                loading={isLoading}
                onClick={handleSubmitUpdateWorkspace(onSubmitUpdateWorkspace)}
                size="small"
                fullWidth={isPhoneScreen}
                variant="contained"
                type="submit"
                color="buttongreen"
                sx={{
                  fontWeight: "bold",
                  marginTop: isPhoneScreen ? 2 : 0,
                  py: 1,
                  px: 2,
                }}
              >
                Save
              </LoadingButton>
            </Stack>
          </Grid>
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
