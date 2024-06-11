'use client'
import * as React from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PrivateRoute from "@/routes/PrivateRoute";
import { Autocomplete, Avatar, AvatarGroup, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import defaultAxios, { AxiosError } from "axios";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Swal from "sweetalert2";
import { useModal } from "@/context/modalContext";
import CardBoard from "@/app/components/CardBoard/CardBoard";
import CardCreateBoard from "@/app/components/CardCreateBoard/CardCreateBoard";
import useWorkspaceBoards from "@/services/queries/useWorkspaceBoards";
import { useAuth } from "@/context/authContext";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useWorkspaceDetail from "@/services/queries/useWorkspaceDetail";
import useBoard from "@/services/queries/useBoard";
import { useRouter } from "next/navigation";
import axios from "@/services/axios";
import { DefaultResponse, StarredResponse } from "@/constants/types";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import useBoardCollaborators from "@/services/queries/useBoardCollaborators";
import useWorkspaceMembers from "@/services/queries/useWorkspaceMembers";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import useUserData from "@/services/queries/useUserData";
import useBoardList from "@/services/queries/useBoardList";
import CardList from "@/app/components/CardList/CardList";
import { mdiPlus } from '@mdi/js';
import Icon from "@mdi/react";

const Board: NextPage = () => {
  const theme = useTheme();
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const { workspaceId, boardId } = useAuth();
  const { isFetchingItems, cancelFetchingItems } = useModal();
  const { data: dataBoard, refetch: refetchBoard } = useBoard(boardId);
  const { data: dataBoardCollab, refetch: refetchBoardCollab } = useBoardCollaborators(boardId);
  const { data: dataBoardList, refetch: refetchBoardList } = useBoardList(boardId);
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [isLoading, setLoading] = useState<boolean>(false);
  const [idUser, setIdUser] = useState<number>();
  const [idPriv, setIdPriv] = useState<number>();
  const [title, setTitle] = useState<string>();
  const [titleList, setTitleList] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [isNewList, setIsNewList] = useState<boolean>(false);
  const { data: dataMembers, refetch: refetchMembers } = useWorkspaceMembers(workspaceId);
  const { data: dataUser } = useUserData();
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const Router = useRouter();

  const [anchorElC, setAnchorElC] = React.useState<null | HTMLElement>(null);

  const openC = Boolean(anchorElC);
  const handleClickC = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElC(event.currentTarget);
  };
  const handleCloseC = () => {
    setAnchorElC(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeModalUser = () => {
    setIsOpenModalUser(false);
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateBoard();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeList = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleList(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      updateBoard();
    }
  };

  const handleErrorResponse = useCallback((error: any) => {
    if (defaultAxios.isAxiosError(error)) {
      const serverError = error as AxiosError<any>;
      if (serverError && serverError.response) {
        console.log(`serverError`, serverError.response);
        if (serverError.response!.status === 400) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `${serverError.response.data.error}`,
            icon: "error",
            confirmButtonColor: "#252525",
            customClass: {
              container: "my-swal",
            },
          });
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
        refetchBoard();
        refetchBoardCollab();
        refetchBoardList();
        refetchMembers();
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchBoard, refetchBoardCollab, refetchBoardList, refetchMembers],
  );

  const star = useCallback(
    async () => {
      if (dataBoard && Boolean(dataBoard[0].is_starred)) {
        try {
          const { data } = await axios.delete<StarredResponse>(
            `users/star/${dataBoard[0].id}`
          );
          if (data) {
            refetch && refetch();
          }
        } catch (error) {
          console.log(error)
          handleErrorResponse(error);
        }
      } else {
        try {
          const { data } = await axios.post<StarredResponse>(
            "boards/star", {
            board_id: dataBoard && dataBoard[0].id,
          }, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
          );
          if (data) {
            refetch && refetch();
          }
        } catch (error) {
          console.log(error)
          handleErrorResponse(error);
        }
      }
    },
    [dataBoard, handleErrorResponse, refetch],
  );

  const inviteUser = useCallback(
    async () => {
      setLoading(true);
      console.log('id', idUser, "&", idPriv)
      try {
        const { data } = await axios.post<DefaultResponse>(
          `boards/${boardId}/collaborator`, {
          user_id: idUser,
          privilege_id: idPriv,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!data.errno) {
          Swal.fire({
            title: "User Added",
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
          closeModalUser();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [boardId, handleErrorResponse, idPriv, idUser, refetch],
  );

  const updateBoard = useCallback(
    async (id?: number) => {
      setLoading(true);
      try {
        const { data } = await axios.put<DefaultResponse>(
          `boards/${boardId}`, {
          board_title: title ?? (dataBoard && dataBoard[0].board_title),
          visibility: id ?? (dataBoard && dataBoard[0].visibility_id),
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!data.errno) {
          refetch();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [boardId, dataBoard, handleErrorResponse, refetch, title],
  );

  const newList = useCallback(
    async () => {
      setLoading(true);
      try {
        const { data } = await axios.post<DefaultResponse>(
          `boards/${boardId}/list`, {
          title: titleList,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!data.errno) {
          refetch();
        }
        setLoading(false);
        setIsNewList(false);
        setTitleList(undefined);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [boardId, handleErrorResponse, refetch, titleList],
  );

  React.useEffect(() => {
    if (isFetchingItems) {
      refetch();
      cancelFetchingItems();
    }
  }, [cancelFetchingItems, isFetchingItems, refetch]);

  React.useEffect(() => {
    if (!title && dataBoard && dataBoard?.length > 0) {
      setTitle(dataBoard[0].board_title);
    }
  }, [dataBoard, title]);

  return (
    <PrivateRoute>
      <Grid container
        alignItems="center"
      >
        {dataBoard && dataBoard.length > 0 &&
          <Grid item xs={12} mb={0.5} py={1} px={isPhoneScreen ? 2 : 3} bgcolor={'primary.main'} >
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Stack flexDirection={'row'} gap={1} alignItems={"center"}>
                {isEditing ? (
                  <TextField
                    value={title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    inputProps={{ style: { paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'white', borderRadius: 8 } }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: '1rem',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        padding: 0,
                        border: 0,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    fontWeight={"600"}
                    color={'white'}
                    onClick={handleTextClick}
                  >
                    {dataBoard[0] && dataBoard[0].board_title}
                  </Typography>
                )}
                {dataBoard && Boolean(dataBoard[0].is_starred) ?
                  <IconButton
                    onClick={() => {
                      star();
                    }}
                  >
                    <FavoriteIcon color="error" />
                  </IconButton> :
                  <IconButton
                    onClick={() => {
                      star();
                    }}
                  >
                    <FavoriteOutlinedIcon color="error" />
                  </IconButton>
                }
                {dataBoard && dataBoard[0].visibility_id === 1 ?
                  <IconButton
                    onClick={handleClickC}
                    sx={{ pl: 0 }}
                  >
                    <LockOutlinedIcon sx={{ color: 'white' }} />
                  </IconButton> :
                  <IconButton
                    onClick={handleClickC}
                    sx={{ pl: 0 }}
                  >
                    <PeopleOutlineIcon sx={{ color: 'white' }} />
                  </IconButton>
                }
                <Menu
                  id="basic-menu"
                  elevation={0}
                  anchorEl={anchorElC}
                  open={openC}
                  onClose={handleCloseC}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: 2,
                      borderStyle: "solid",
                      borderWidth: 1,
                      backgroundColor: "secondary.main",
                      borderColor: "secondary.main",
                      marginTop: theme.spacing(1),
                      "& .MuiMenuItem-root": {
                        padding: "12px, 20px, 12px, 20px",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseC();
                      updateBoard(1);
                    }}
                  >
                    <LockOutlinedIcon
                      sx={{
                        width: 18,
                        height: 18,
                        color: "#c5c5c5",
                        marginRight: 1,
                      }}
                    />
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color={"#c5c5c5"}
                    >
                      Private
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseC();
                      updateBoard(2);
                    }}
                    sx={{ borderTop: 1, borderColor: 'primary.main' }}
                  >
                    <PeopleOutlineIcon
                      sx={{
                        width: 18,
                        height: 18,
                        color: "#c5c5c5",
                        marginRight: 1,
                      }}
                    />
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color={"#c5c5c5"}
                    >
                      Workspace
                    </Typography>
                  </MenuItem>
                </Menu>
              </Stack>
              <Stack flexDirection={'row'} gap={1} alignItems={"center"}>
                {dataBoardCollab &&
                  <AvatarGroup max={isPhoneScreen ? 2 : 4} sx={{
                    '& .MuiAvatar-root': { width: 32, height: 32, borderColor: 'primary.main', },
                  }}>
                    {dataBoardCollab.map((dat, idx) =>
                      <Tooltip key={String(idx)} title={dat?.user_username ?? "-"} slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}>
                        <Avatar
                          sx={{
                            backgroundColor: "secondary.main",
                            width: 32, height: 32,
                            color: 'white',
                          }}
                          alt={dat?.user_username ?? "-"}
                        >
                          {avatarAlt(dat?.user_username ?? "A")}
                        </Avatar>
                      </Tooltip>
                    )}
                  </AvatarGroup>
                }
                <IconButton
                  onClick={() => setIsOpenModalUser(true)}
                  sx={{ backgroundColor: "buttongreen.main", borderRadius: 2 }}
                >
                  <PersonAddAltIcon sx={{ color: 'white', height: 16, width: 16 }} />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        }
        <Stack flex={1} flexDirection={'row'} sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          width: `50vw`,
          height: "80vh",
        }} alignItems={"flex-start"} p={2}>
          <Stack gap={1.5} flexDirection={'row'}>
            {dataBoardList && dataBoardList.map((dat, idx) =>
              <CardList namaList={dat.title} key={String(idx)} id={dat.id} refetch={refetch} namaCard={dat.title} click={() => console.log('pressed')} />
            )}
            {isNewList ?
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  width: 200,
                  padding: 2,
                  height: '100%'
                }}
              >
                <Stack gap={1} >
                  <TextField
                    value={titleList}
                    onChange={handleChangeList}
                    autoFocus
                    inputProps={{ style: { padding: 10, backgroundColor: 'white', borderRadius: 8 } }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        padding: 0,
                        border: 0,
                      },
                    }}
                  />
                  <Stack gap={0.5} flexDirection={'row'} justifyContent={"space-between"}>
                    <Button fullWidth
                      onClick={newList} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                      Add list
                    </Button>
                    <Button fullWidth
                      onClick={() => { setIsNewList(false); setTitleList(undefined) }} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="error">
                      Close
                    </Button>
                  </Stack>
                </Stack>
              </Box> :
              <Button
                onClick={() => setIsNewList(true)} sx={{ fontSize: 12, height: 35, minWidth: 200, }} variant="contained" color="secondary" startIcon={
                  <Icon path={mdiPlus} size={1} />
                }>
                Add list
              </Button>}
          </Stack>
        </Stack>
        <Dialog
          maxWidth="xs"
          fullWidth={true}
          fullScreen={isPhoneScreen}
          open={isOpenModalUser}
          onClose={closeModalUser}
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
              Add to Board
            </DialogTitle>
            {!isPhoneScreen &&
              <IconButton
                aria-label="close"
                onClick={closeModalUser}
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
              padding: isPhoneScreen ? 2.5 : 4.5,
            }}
          >
            <Stack flexDirection={"column"} gap={0.5}>
              <Typography
                fontWeight={500}
              >
                User
              </Typography>
              <Autocomplete
                fullWidth
                size="medium"
                disablePortal
                id="combo-box-demo"
                options={dataMembers?.filter((li) => li.user_id !== dataUser?.user_id) ?? []}
                getOptionLabel={(option) => option.user_username}
                onChange={(_event, user: any) => {
                  setIdUser(user.user_id)
                }
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
            <Stack flexDirection={"column"} gap={0.5} mt={1}>
              <Typography
                fontWeight={500}
              >
                Privilege
              </Typography>
              <Autocomplete
                fullWidth
                size="medium"
                disablePortal
                id="combo-box-demo"
                options={[{ id: 1, name: 'View' }, { id: 2, name: 'View, Edit' }, { id: 3, name: 'View, Edit, Delete' }]}
                getOptionLabel={(option) => option.name}
                onChange={(_event, data: any) => {
                  setIdPriv(data.id)
                }
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </DialogContent>
          <DialogActions
            disableSpacing
            sx={{ padding: isPhoneScreen ? 2.5 : 4.5, flexDirection: isPhoneScreen ? 'column' : 'row' }}
          >
            {isPhoneScreen &&
              <Button
                size="small"
                fullWidth={isPhoneScreen}
                variant="outlined"
                onClick={closeModalUser}
                color="primary"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
            }
            <LoadingButton
              loading={isLoading}
              onClick={inviteUser}
              size="small"
              disabled={!idPriv || !idUser}
              fullWidth={isPhoneScreen}
              variant="contained"
              type="submit"
              color="buttongreen"
              sx={{
                fontWeight: "bold",
                marginTop: isPhoneScreen ? 2 : 0,
              }}
            >
              Add User
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Grid>
    </PrivateRoute>
  );
};

export default Board;
