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
import { DefaultResponse, TBVisibility, TUser, TWorkspace, TWType } from "@/constants/types";
import LoadingButton from "@mui/lab/LoadingButton";
import useBoardVisibilities from "@/services/queries/useBoardVisibilities";
import useWorkspace from "@/services/queries/useWorkspace";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";
import useUserData from "@/services/queries/useUserData";

interface IInviteUser {
    invited_user_id: number;
    workspace_id: number;
}

interface ICreateWorkspace {
    name: string;
    type_id: TWType;
    description?: string;
}

interface ICreateBoard {
    board_title: string;
    workspace: TBVisibility;
    visibility: TBVisibility;
}

const schemaInviteUser = yup
    .object({
        invited_user_id: yup
            .number()
            .required("Required"),
        workspace_id: yup.number().required("Required"),
    })
    .required();

const schemaCreateWorkspace = yup
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

const schemaCreateBoard = yup
    .object({
        board_title: yup
            .string()
            .required("Required"),
        visibility: yup.object().shape({
            id: yup.number().required("Required"),
            name: yup.string().required("Required"),
        }).required("Required"),
        workspace: yup.object().shape({
            id: yup.number().required("Required"),
            name: yup.string().required("Required"),
        }).required("Required"),
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
    isFetchingItems: boolean;
    setFetchingItems: () => void;
    cancelFetchingItems: () => void;
}

interface IModalContext {
    children: ReactNode;
}

const ModalContext = createContext<State | undefined>(undefined);

const ModalProvider = ({ children }: IModalContext) => {
    const theme = useTheme();
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const Router = useRouter();
    const { setWorkspaceId } = useAuth();

    const [worksId, setWorksId] = useState<number>();
    const [isFetchingItems, setIsFetchingItems] = useState(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isOpenModalUser, setIsOpenModalUser] = useState(false);
    const [isOpenModalBoard, setIsOpenModalBoard] = useState(false);
    const [isOpenModalWorkspace, setIsOpenModalWorkspace] = useState(false);
    const { data: dataWTypes } = useWorkspaceTypes();
    const { data: dataBVisibilites } = useBoardVisibilities();
    const { data: dataAUssers } = useAllUsers();
    const { data: dataUser } = useUserData();
    const { data: dataWorkspace } = useWorkspace();

    const workspaces = dataWorkspace?.map((li) => ({
        id: li.workspace_id,
        name: li.workspace_name,
    }));

    const selWorkspaces = React.useMemo(() => {
        if (worksId) {
            return workspaces?.find((li) => li.id === worksId);
        }
        return undefined;
    }, [worksId, workspaces]);

    const setFetchingItems = useCallback(() => {
        setIsFetchingItems(true);
    }, []);

    const cancelFetchingItems = useCallback(() => {
        setIsFetchingItems(false);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const closeModalUser = () => {
        setIsOpenModalUser(false);
        resetInviteUser();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const closeModalBoard = () => {
        setIsOpenModalBoard(false);
        resetCreateBoard();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const closeModalWorkspace = () => {
        setIsOpenModalWorkspace(false);
        resetCreateWorkspace();
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
            workspace_id: worksId ?? undefined,
        }),
        [worksId],
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
                const { data } = await axios.post<DefaultResponse>(
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
        inviteUser(data);
    };

    const initialValuesCreateWorkspace = React.useMemo(
        () => ({
            name: "",
            type_id: { id: undefined, name: "" },
            description: "",
        }),
        [],
    );

    const {
        handleSubmit: handleSubmitCreateWorkspace,
        formState: { errors: errorsCreateWorkspace },
        control: controlCreateWorkspace,
        reset: resetCreateWorkspace,
    } = useForm<ICreateWorkspace>({
        resolver: yupResolver(schemaCreateWorkspace),
        defaultValues: initialValuesCreateWorkspace,
    });

    const createWorkspace = useCallback(
        async (values: ICreateWorkspace) => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    "workspace/", {
                    name: values.name,
                    type_id: values.type_id.id,
                    description: values.description,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    Swal.fire({
                        title: "Workspace Created",
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
                    resetCreateWorkspace();
                    setFetchingItems();
                    closeModalWorkspace();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [Router, closeModalWorkspace, handleErrorResponse, resetCreateWorkspace, setFetchingItems],
    );

    const onSubmitCreateWorkspace = (data: ICreateWorkspace) => {
        createWorkspace(data);
    };

    const initialValuesCreateBoard = React.useMemo(
        () => ({
            board_title: "",
            visibility: { id: undefined, name: "" },
            workspace: { id: undefined, name: "" },
        }),
        [],
    );

    const {
        handleSubmit: handleSubmitCreateBoard,
        setValue: setValueCreateBoard,
        formState: { errors: errorsCreateBoard },
        control: controlCreateBoard,
        reset: resetCreateBoard,
    } = useForm<ICreateBoard>({
        resolver: yupResolver(schemaCreateBoard),
        defaultValues: initialValuesCreateBoard,
    });

    const createBoard = useCallback(
        async (values: ICreateBoard) => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `workspace/${values.workspace.id}/board`, {
                    board_title: values.board_title,
                    visibility: values.visibility.id,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    Swal.fire({
                        title: "Board Created",
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
                    setWorkspaceId(values.workspace.id);
                    Router.push("/home/boards");
                    setWorksId(undefined);
                    resetCreateBoard();
                    setFetchingItems();
                    closeModalBoard();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [Router, closeModalBoard, handleErrorResponse, resetCreateBoard, setFetchingItems, setWorkspaceId],
    );

    const onSubmitCreateBoard = (data: ICreateBoard) => {
        createBoard(data);
    };

    useEffect(() => {
        if (worksId) {
            setValueInviteUser('workspace_id', worksId);
            selWorkspaces && setValueCreateBoard('workspace', selWorkspaces);
        }
    }, [selWorkspaces, setValueCreateBoard, setValueInviteUser, worksId]);

    const value = useMemo(() => ({
        isOpenModalUser,
        setIsOpenModalUser,
        isOpenModalBoard,
        setIsOpenModalBoard,
        isOpenModalWorkspace,
        setIsOpenModalWorkspace,
        setWorksId,
        isFetchingItems,
        setFetchingItems,
        cancelFetchingItems,
    }), [cancelFetchingItems, isFetchingItems, isOpenModalBoard, isOpenModalUser, isOpenModalWorkspace, setFetchingItems]);

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
                            options={dataAUssers?.filter((li) => li.id !== dataUser?.user_id) ?? []}
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
                    <LoadingButton
                        loading={isLoading}
                        onClick={handleSubmitInviteUser(onSubmitInviteUser)}
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
                    </LoadingButton>
                </DialogActions>
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
                            <Controller
                                control={controlCreateBoard}
                                name="board_title"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="board_title"
                                        size="medium"
                                        error={Boolean(errorsCreateBoard.board_title)}
                                        helperText={
                                            errorsCreateBoard.board_title
                                                ? errorsCreateBoard.board_title.message
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
                                Workspace
                            </Typography>
                            <Controller
                                control={controlCreateBoard}
                                name="workspace"
                                render={({
                                    field: { onChange, value },
                                }) => (
                                    <Autocomplete
                                        fullWidth
                                        size="medium"
                                        disablePortal
                                        id="workspace"
                                        options={workspaces ?? []}
                                        value={value}
                                        onChange={(_event, newType: any,) => {
                                            onChange(newType);
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params}
                                            error={Boolean(errorsCreateBoard.workspace)}
                                            helperText={
                                                errorsCreateBoard.workspace && errorsCreateBoard.workspace.id
                                                    ? errorsCreateBoard.workspace.id.message
                                                    : ""
                                            } />}
                                    />
                                )}
                            />
                        </Stack>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}

                            >
                                Visibility
                            </Typography>
                            <Controller
                                control={controlCreateBoard}
                                name="visibility"
                                render={({
                                    field: { onChange },
                                }) => (
                                    <Autocomplete
                                        fullWidth
                                        size="medium"
                                        disablePortal
                                        id="visibility"
                                        options={dataBVisibilites ?? []}
                                        onChange={(_event, newType: any,) => {
                                            onChange(newType);
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params}
                                            error={Boolean(errorsCreateBoard.visibility)}
                                            helperText={
                                                errorsCreateBoard.visibility && errorsCreateBoard.visibility.id
                                                    ? errorsCreateBoard.visibility.id.message
                                                    : ""
                                            } />}
                                    />
                                )}
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
                    <LoadingButton
                        loading={isLoading}
                        size="small"
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        type="submit"
                        onClick={handleSubmitCreateBoard(onSubmitCreateBoard)}
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Create Board
                    </LoadingButton>
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
                            <Controller
                                control={controlCreateWorkspace}
                                name="name"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="name"
                                        size="medium"
                                        error={Boolean(errorsCreateWorkspace.name)}
                                        helperText={
                                            errorsCreateWorkspace.name
                                                ? errorsCreateWorkspace.name.message
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
                                control={controlCreateWorkspace}
                                name="type_id"
                                render={({
                                    field: { onChange },
                                }) => (
                                    <Autocomplete
                                        fullWidth
                                        size="medium"
                                        disablePortal
                                        id="type_id"
                                        options={dataWTypes ?? []}
                                        onChange={(_event, newType: any,) => {
                                            onChange(newType);
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params}
                                            error={Boolean(errorsCreateWorkspace.type_id)}
                                            helperText={
                                                errorsCreateWorkspace.type_id && errorsCreateWorkspace.type_id.id
                                                    ? errorsCreateWorkspace.type_id.id.message
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
                                control={controlCreateWorkspace}
                                name="description"
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        size="medium"
                                        id="description"
                                        error={Boolean(errorsCreateWorkspace.description)}
                                        helperText={
                                            errorsCreateWorkspace.description
                                                ? errorsCreateWorkspace.description.message
                                                : ""
                                        }
                                        {...field}
                                    />)}
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
                    <LoadingButton
                        loading={isLoading}
                        onClick={handleSubmitCreateWorkspace(onSubmitCreateWorkspace)}
                        size="small"
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        type="submit"
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Create Workspace
                    </LoadingButton>
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
