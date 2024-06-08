'use client';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Stack from "@mui/material/Stack";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Menu, MenuItem, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useWorkspaceTypes from "@/services/queries/useWorkspaceTypes";
import useAllUsers from "@/services/queries/useAllUsers";
import axios from "../services/axios";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import defaultAxios, { AxiosError } from "axios";
import { DefaultIdResponse, DefaultResponse, TUser } from "@/constants/types";

interface IInviteUser {
    invited_user_id: number;
    workspace_id: number;
}
const schemaInviteUser = yup
    .object({
        invited_user_id: yup
            .number()
            .required("Kolom wajib diisi"),
        workspace_id: yup.number().required("Kolom wajib diisi"),
    })
    .required();

interface State {
    isOpenModalUser: boolean;
    setIsOpenModalUser: (value: boolean) => void;
    isOpenModalBoard: boolean;
    setIsOpenModalBoard: (value: boolean) => void;
    isOpenModalWorkspace: boolean;
    setIsOpenModalWorkspace: (value: boolean) => void;
    setWorksId: (value: number) => void;
}

interface IModalContext {
    children: ReactNode;
}

const ModalContext = createContext<State | undefined>(undefined);

const ModalProvider = ({ children }: IModalContext) => {
    const theme = useTheme();
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));

    const [wokrsId, setWorksId] = useState<number>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isOpenModalUser, setIsOpenModalUser] = useState(false);
    const [isOpenModalBoard, setIsOpenModalBoard] = useState(false);
    const [isOpenModalWorkspace, setIsOpenModalWorkspace] = useState(false);
    const { data: dataWTypes } = useWorkspaceTypes();
    const { data: dataAUssers } = useAllUsers();

    const closeModalUser = () => {
        setIsOpenModalUser(false);
        resetInviteUser();
    };
    const handleInvite = () => {
        closeModalUser();
    };

    const closeModalBoard = () => setIsOpenModalBoard(false);
    const handleCreateBoard = () => {
        closeModalBoard();
    };

    const closeModalWorkspace = () => setIsOpenModalWorkspace(false);
    const handleCreateWorkspace = () => {
        closeModalWorkspace();
    };

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

                if (serverError.response!.status === 401) {
                    Swal.fire({
                        title: `Wrong email or password`,
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

    const initialValuesInviteUser = React.useMemo(
        () => ({
            invited_user_id: undefined,
            workspace_id: wokrsId ?? undefined,
        }),
        [wokrsId],
    );

    const {
        handleSubmit: handleSubmitInviteUser,
        setValue: setValueInviteUser,
        watch: watchInviteUser,
        reset: resetInviteUser,
    } = useForm<IInviteUser>({
        resolver: yupResolver(schemaInviteUser),
        defaultValues: initialValuesInviteUser,
    });

    const watchUser = watchInviteUser("invited_user_id");

    const inviteUser = useCallback(
        async (values: IInviteUser) => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultIdResponse>(
                    "workspace/invite", {
                    invited_user_id: values.invited_user_id,
                    workspace_id: values.workspace_id,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (data.insertId) {
                    Swal.fire({
                        title: "Invitation Sent",
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
                    closeModalUser();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalUser, handleErrorResponse],
    );

    const onSubmitInviteUser = (data: IInviteUser) => {
        console.log(data);
        inviteUser(data);
    };

    useEffect(() => {
        if (wokrsId) {
            setValueInviteUser('workspace_id', wokrsId);
        }
    }, [setValueInviteUser, wokrsId]);

    const value = useMemo(() => ({
        isOpenModalUser,
        setIsOpenModalUser,
        isOpenModalBoard,
        setIsOpenModalBoard,
        isOpenModalWorkspace,
        setIsOpenModalWorkspace,
        setWorksId,
    }), [isOpenModalBoard, isOpenModalUser, isOpenModalWorkspace]);

    return (
        <ModalContext.Provider value={value}>
            {children}
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
                <form
                    onSubmit={handleSubmitInviteUser(onSubmitInviteUser)}
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
                            Invite to Workspace
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
                                options={dataAUssers ?? []}
                                getOptionLabel={(option) => option.username}
                                onChange={(_event, user: any) => {
                                    setValueInviteUser('invited_user_id', user.id)
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
                        <Button
                            size="small"
                            disabled={!watchUser}
                            fullWidth={isPhoneScreen}
                            variant="contained"
                            type="submit"
                            color="buttongreen"
                            sx={{
                                fontWeight: "bold",
                                marginTop: isPhoneScreen ? 2 : 0,
                            }}
                        >
                            Invite User
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalBoard}
                onClose={closeModalBoard}
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
                        Create Board
                    </DialogTitle>
                    {!isPhoneScreen &&
                        <IconButton
                            aria-label="close"
                            onClick={closeModalBoard}
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
                    <Stack flexDirection={"column"} gap={1.5}>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Board title
                            </Typography>
                            <OutlinedInput
                                id="name"
                                size="medium"
                            />
                        </Stack>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Workspace
                            </Typography>
                            <Autocomplete
                                fullWidth
                                size="medium"
                                disablePortal
                                id="combo-box-demo"
                                options={["Bagus Workspace", "Bagus Workspace2"]}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Visibility
                            </Typography>
                            <Autocomplete
                                fullWidth
                                size="medium"
                                disablePortal
                                id="combo-box-demo"
                                options={["Private", "Workspace", "Public"]}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
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
                            onClick={closeModalBoard}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>
                    }
                    <Button
                        size="small"
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={handleCreateBoard}
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Create Board
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalWorkspace}
                onClose={closeModalWorkspace}
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
                        Create Workspace
                    </DialogTitle>
                    {!isPhoneScreen &&
                        <IconButton
                            aria-label="close"
                            onClick={closeModalWorkspace}
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
                    <Stack flexDirection={"column"} gap={1.5}>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Workspace name
                            </Typography>
                            <OutlinedInput
                                id="name"
                                size="medium"
                            />
                        </Stack>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Workspace type
                            </Typography>
                            <Autocomplete
                                fullWidth
                                size="medium"
                                disablePortal
                                id="combo-box-demo"
                                options={dataWTypes ?? []}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} />}
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
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                size="medium"
                                id="combo-box-demo"
                            />
                        </Stack>
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
                            onClick={closeModalWorkspace}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>
                    }
                    <Button
                        size="small"
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={handleCreateWorkspace}
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Create Workspace
                    </Button>
                </DialogActions>
            </Dialog>
        </ModalContext.Provider>
    );
};

const useModal = () => {
    const context = React.useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

export { ModalContext, ModalProvider, useModal };
