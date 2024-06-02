'use client';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from "react";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Menu, MenuItem, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface State {
    isOpenModalUser: boolean;
    setIsOpenModalUser: (value: boolean) => void;
    isOpenModalBoard: boolean;
    setIsOpenModalBoard: (value: boolean) => void;
    isOpenModalWorkspace: boolean;
    setIsOpenModalWorkspace: (value: boolean) => void;
}

interface IModalContext {
    children: ReactNode;
}

const ModalContext = createContext<State | undefined>(undefined);

const ModalProvider = ({ children }: IModalContext) => {
    const theme = useTheme();
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));

    const [isOpenModalUser, setIsOpenModalUser] = useState(false);
    const [isOpenModalBoard, setIsOpenModalBoard] = useState(false);
    const [isOpenModalWorkspace, setIsOpenModalWorkspace] = useState(false);

    const closeModalUser = () => setIsOpenModalUser(false);
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

    const value = useMemo(() => ({
        isOpenModalUser,
        setIsOpenModalUser,
        isOpenModalBoard,
        setIsOpenModalBoard,
        isOpenModalWorkspace,
        setIsOpenModalWorkspace,
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
                            color={"#464E4B"}
                        >
                            User
                        </Typography>
                        <Autocomplete
                            fullWidth
                            size="medium"
                            disablePortal
                            id="combo-box-demo"
                            options={["Bagus1", "Bagus2"]}
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
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={handleInvite}
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Invite User
                    </Button>
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
                                color={"#464E4B"}
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
                                color={"#464E4B"}
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
                                color={"#464E4B"}
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
                                color={"#464E4B"}
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
                                color={"#464E4B"}
                            >
                                Workspace type
                            </Typography>
                            <Autocomplete
                                fullWidth
                                size="medium"
                                disablePortal
                                id="combo-box-demo"
                                options={["Education", "Sport"]}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                        <Stack flexDirection={"column"} gap={0.5}>
                            <Typography
                                fontWeight={500}
                                color={"#464E4B"}
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
