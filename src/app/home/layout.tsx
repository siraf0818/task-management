'use client';
import * as React from "react";
import { usePathname } from 'next/navigation'
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/dashboard";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from "next/link";
import { Badge, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Menu, MenuItem } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useAuth } from "@/context/authContext";
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useModal } from "@/context/modalContext";
import useWorkspace from "@/services/queries/useWorkspace";
import useUserData from "@/services/queries/useUserData";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useWorkspaceInvitations from "@/services/queries/useWorkspaceInvitations";
import { DefaultResponse, TUInvitation } from "@/constants/types";
import { useCallback } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import axios from "@/services/axios";
import { LoadingButton } from "@mui/lab";
import useNotifications from "@/services/queries/useNotif";

interface Props {
    children: React.ReactNode;
}

export default function PageLayout(props: Props) {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [isOpenModalLogout, setIsOpenModalLogout] = React.useState(false);
    const [isOpenModalInv, setIsOpenModalInv] = React.useState(false);
    const [isOpenModalClear, setIsOpenModalClear] = React.useState(false);
    const [dataInv, setDataInv] = React.useState<TUInvitation>();
    const { logout, workspaceId, setWorkspaceId } = useAuth();
    const { setIsOpenModalUser, setIsOpenModalBoard, setIsOpenModalWorkspace, setWorksId, isFetchingItems, cancelFetchingItems } = useModal();
    const { data: dataWorkspace, refetch: refetchWorkspace } = useWorkspace();
    const { data: dataUser } = useUserData();
    const { data: dataUserInvitations, refetch: refetchInvitations } = useWorkspaceInvitations();
    const { data: dataNotifications, refetch: refetchNotifications } = useNotifications();

    const handleKeluar = () => {
        logout();
        closeModalLogout();
    };

    const openModalLogout = () => setIsOpenModalLogout(true);
    const closeModalLogout = () => setIsOpenModalLogout(false);

    const openModalInv = () => setIsOpenModalInv(true);
    const closeModalInv = () => setIsOpenModalInv(false);

    const openModalClear = () => setIsOpenModalClear(true);
    const closeModalClear = () => setIsOpenModalClear(false);

    const { children } = props;
    const theme = useTheme();
    const pathName = usePathname();
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const isLaptopScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorElC, setAnchorElC] = React.useState<null | HTMLElement>(null);

    const openC = Boolean(anchorElC);
    const handleClickC = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElC(event.currentTarget);
    };
    const handleCloseC = () => {
        setAnchorElC(null);
    };

    const [anchorElI, setAnchorElI] = React.useState<null | HTMLElement>(null);

    const openI = Boolean(anchorElI);
    const handleClickI = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElI(event.currentTarget);
    };
    const handleCloseI = () => {
        setAnchorElI(null);
    };

    const [anchorElN, setAnchorElN] = React.useState<null | HTMLElement>(null);

    const openN = Boolean(anchorElN);
    const handleClickN = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElN(event.currentTarget);
    };
    const handleCloseN = () => {
        setAnchorElN(null);
    };

    const [expandedMenu, setExpandedMenu] = React.useState<number>(workspaceId);

    const handleExpand = (param: number) => {
        setWorkspaceId(param);
    };


    const handleExpandMenu = (param: number) => {
        if (param === expandedMenu) {
            setExpandedMenu(0);
        } else {
            setExpandedMenu(param);
        }
    };

    React.useEffect(() => {
        if (workspaceId) {
            setExpandedMenu(workspaceId);
        }
    }, [workspaceId]);

    const drawerWidth = 272;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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
                refetchInvitations();
                refetchNotifications();
            } catch (error) {
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, refetchInvitations, refetchNotifications, refetchWorkspace],
    );

    const accept = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data: dataN } = await axios.post<DefaultResponse>(
                    `workspace/invitation/accept`, {
                    invitation_id: dataInv?.invitation_id,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!dataN.errno) {
                    Swal.fire({
                        title: "Invitation Accepted",
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
                    closeModalInv();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
                closeModalInv();
            }
        },
        [dataInv?.invitation_id, handleErrorResponse, refetch],
    );

    const refuse = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data: dataN } = await axios.delete<DefaultResponse>(
                    `users/refuse/${dataInv?.invitation_id}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!dataN.errno) {
                    Swal.fire({
                        title: "Invitation Refused",
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
                    closeModalInv();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
                closeModalInv();
            }
        },
        [dataInv?.invitation_id, handleErrorResponse, refetch],
    );

    const clear = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data: dataN } = await axios.delete<DefaultResponse>(
                    `users/notification`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!dataN.errno) {
                    Swal.fire({
                        title: "Notification Cleared",
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
                    closeModalClear();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
                closeModalClear();
            }
        },
        [handleErrorResponse, refetch],
    );

    React.useEffect(() => {
        if (isFetchingItems) {
            refetch();
            cancelFetchingItems();
        }
    }, [cancelFetchingItems, isFetchingItems, refetch]);

    const newDrawer = (
        // <div>
        <Stack
            display="flex"
            flex={1}
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            paddingX={1.5}
            paddingTop={0.5}
            bgcolor={"secondary.main"}
        >
            <Box width="100%">
                <List component="nav">
                    <ListItemButton
                        component={Link}
                        href="/home"
                        selected={pathName === "/home"}
                        sx={{
                            paddingY: 2,
                            paddingX: 1.5,
                            borderRadius: 2,
                            gap: 1,
                            "&.Mui-selected": {
                                backgroundColor: "white",
                                color: "secondary.main",
                            },
                        }}
                    >
                        <DashboardIcon
                            sx={{
                                width: 24,
                                height: 24,
                                color:
                                    pathName === "/home"
                                        ? "secondary.main"
                                        : "#7C8883",
                            }}
                        />
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography
                                    style={{
                                        fontWeight: 500,
                                        color:
                                            pathName === "/home"
                                                ? "secondary.main"
                                                : "#7C8883",
                                    }}
                                >
                                    All Boards
                                </Typography>
                            }
                        />
                    </ListItemButton>
                    {dataWorkspace && dataWorkspace.map((dat, idx) =>
                        <React.Fragment key={String(idx)}>
                            <ListItemButton
                                onClick={() => handleExpandMenu(dat.workspace_id)}
                                sx={{
                                    paddingY: 2,
                                    paddingX: 1.5,
                                    borderRadius: 2,
                                    gap: 1,
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(43, 115, 81, 0)",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: "#7C8883",
                                        width: 30,
                                        height: 30,
                                    }}
                                    alt={dat.workspace_name} variant="rounded"
                                >
                                    <Typography>{avatarAlt(dat.workspace_name)}</Typography>
                                </Avatar>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography
                                            style={{
                                                fontWeight: 500,
                                                color: "#7C8883",
                                            }}
                                        >
                                            {dat.workspace_name}
                                        </Typography>
                                    }
                                />
                                {expandedMenu === dat.workspace_id ? (
                                    <ExpandLess
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            color: "#A8B4AF",
                                        }}
                                    />
                                ) : (
                                    <ExpandMore
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            color: "#A8B4AF",
                                        }}
                                    />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={expandedMenu === dat.workspace_id}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List
                                    sx={{
                                        pl: 1,
                                    }}
                                    component="div"
                                    disablePadding
                                >
                                    <ListItemButton
                                        onClick={() => handleExpand(dat.workspace_id)}
                                        component={Link}
                                        href="/home/boards"
                                        selected={
                                            (pathName === "/home/boards" || pathName === "/home/lists") && workspaceId === dat.workspace_id
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            paddingY: 1,
                                            gap: 1,

                                            "&.Mui-selected": {
                                                backgroundColor: "white",
                                                color: "secondary.main",
                                            },
                                        }}
                                    >
                                        <DashboardIcon
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                color:
                                                    (pathName === "/home/boards" || pathName === "/home/lists") && workspaceId === dat.workspace_id
                                                        ? "secondary.main"
                                                        : "#7C8883",
                                            }}
                                        />
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    style={{
                                                        fontWeight: 500,
                                                        color:
                                                            pathName ===
                                                                "/home/boards" && workspaceId === dat.workspace_id
                                                                ? "secondary.main"
                                                                : "#7C8883",
                                                    }}
                                                >
                                                    Boards
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        onClick={() => handleExpand(dat.workspace_id)}
                                        component={Link}
                                        href="/home/members"
                                        selected={
                                            pathName === "/home/members" && workspaceId === dat.workspace_id
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            paddingY: 1,
                                            gap: 1,

                                            "&.Mui-selected": {
                                                backgroundColor: "white",
                                                color: "secondary.main",
                                            },
                                        }}
                                    >
                                        <PeopleIcon
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                color:
                                                    pathName === "/home/members" && workspaceId === dat.workspace_id
                                                        ? "secondary.main"
                                                        : "#7C8883",
                                            }}
                                        />
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    style={{
                                                        fontWeight: 500,
                                                        color:
                                                            pathName ===
                                                                "/home/members" && workspaceId === dat.workspace_id
                                                                ? "secondary.main"
                                                                : "#7C8883",
                                                    }}
                                                >
                                                    Members
                                                </Typography>
                                            }
                                        />
                                        <IconButton onClick={(event) => {
                                            event.preventDefault();
                                            setIsOpenModalUser(true);
                                            setWorksId(dat.workspace_id);
                                        }}>
                                            <Icon path={mdiPlus} size={1} color={pathName === "/home/members" && workspaceId === dat.workspace_id
                                                ? "secondary.main"
                                                : "#7C8883"} />
                                        </IconButton>
                                    </ListItemButton>
                                    <ListItemButton
                                        onClick={() => handleExpand(dat.workspace_id)}
                                        component={Link}
                                        href="/home/settings"
                                        selected={
                                            pathName === "/home/settings" && workspaceId === dat.workspace_id
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            paddingY: 1,
                                            gap: 1,

                                            "&.Mui-selected": {
                                                backgroundColor: "white",
                                                color: "secondary.main",
                                            },
                                        }}
                                    >
                                        <SettingsIcon
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                color:
                                                    pathName === "/home/settings" && workspaceId === dat.workspace_id
                                                        ? "secondary.main"
                                                        : "#7C8883",
                                            }}
                                        />
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    style={{
                                                        fontWeight: 500,
                                                        color:
                                                            pathName ===
                                                                "/home/settings" && workspaceId === dat.workspace_id
                                                                ? "secondary.main"
                                                                : "#7C8883",
                                                    }}
                                                >
                                                    Settings
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </React.Fragment>
                    )}
                </List>
            </Box>
        </Stack>
    );

    return (
        <Box
            sx={{
                display: "flex",
                paddingTop: isPhoneScreen
                    ? "56px"
                    : isLaptopScreen
                        ? "64px"
                        : "64px",
            }}
        >
            <AppBar
                sx={{
                    display: { xs: "block" },
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <Stack justifyContent={'space-between'} flexDirection={'row'} alignItems={'center'} flex={1}>
                        <Stack flexDirection={'row'} alignItems={'center'} flex={1} >
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: !isPhoneScreen ? 2 : 0, display: { lg: "none" } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            {!isPhoneScreen && <Typography variant="h6" noWrap component="div">
                                Task Management
                            </Typography>
                            }
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                size="small"
                                onClick={handleClickC}
                                sx={{ ml: !isPhoneScreen ? 1 : 0, backgroundColor: isPhoneScreen ? "prymary.main" : "secondary.main", borderRadius: 2 }}
                            >
                                <Icon path={mdiPlus} size={1} color={"white"} />
                            </IconButton>
                        </Stack>
                        <Stack flexDirection={'row'} justifyItems={'flex-end'} gap={1}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleClickN}
                            >
                                {dataNotifications ?
                                    <Badge anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }} badgeContent={dataNotifications.length} sx={{
                                        '& .MuiBadge-badge': {
                                            left: 0,
                                            top: 6,
                                        },
                                    }} color="error">
                                        <NotificationsIcon />
                                    </Badge> :
                                    <NotificationsIcon />
                                }
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleClickI}
                            >
                                {dataUserInvitations ?
                                    <Badge anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }} badgeContent={dataUserInvitations.length} sx={{
                                        '& .MuiBadge-badge': {
                                            left: 0,
                                            top: 6,
                                        },
                                    }} color="error">
                                        <MailOutlineIcon />
                                    </Badge> :
                                    <MailOutlineIcon />
                                }
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleClick}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: "secondary.main",
                                        width: 36,
                                        height: 36,
                                        color: 'white',
                                    }}
                                    alt={dataUser?.username ?? "-"}
                                >
                                    {avatarAlt(dataUser?.username ?? "A")}
                                </Avatar>
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Menu
                        id="basic-menu"
                        elevation={0}
                        anchorEl={anchorElN}
                        open={openN}
                        onClose={handleCloseN}
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
                        {dataNotifications && dataNotifications.length > 0 &&
                            <MenuItem>
                                <Button
                                    fullWidth={true}
                                    variant="contained"
                                    onClick={() => {
                                        openModalClear();
                                        handleCloseN();
                                    }}
                                    color="error"
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Clear notifications
                                </Button>
                            </MenuItem>
                        }
                        {dataNotifications && dataNotifications.length > 0 ? dataNotifications.map((dat, idx) =>
                        (<MenuItem key={String(idx)}
                            sx={{ borderBottom: idx === dataNotifications.length - 1 ? 0 : 1, borderColor: 'primary.main', whiteSpace: 'normal' }}
                        >
                            <Stack flex={1} flexDirection={'row'} gap={1} alignItems={'center'}>
                                <Typography
                                    textOverflow={"ellipsis"}
                                    fontSize={14}
                                    fontWeight={500}
                                    color={"#c5c5c5"}
                                >
                                    {dat.notification}
                                </Typography>
                            </Stack>
                        </MenuItem>)
                        ) :
                            <MenuItem>
                                <Stack flex={1} flexDirection={'row'} gap={1} alignItems={'center'}>
                                    <Typography
                                        textOverflow={"ellipsis"}
                                        fontSize={14}
                                        fontWeight={500}
                                        color={"#c5c5c5"}
                                    >
                                        {`There's no notification for now`}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        }
                    </Menu>
                    <Menu
                        id="basic-menu"
                        elevation={0}
                        anchorEl={anchorElI}
                        open={openI}
                        onClose={handleCloseI}
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
                        {dataUserInvitations && dataUserInvitations.length > 0 ? dataUserInvitations.map((dat, idx) =>
                            <MenuItem
                                key={String(idx)}
                                onClick={() => {
                                    openModalInv();
                                    setDataInv(dat);
                                    handleCloseI();
                                }}
                                sx={{ borderBottom: idx === dataUserInvitations.length - 1 ? 0 : 1, borderColor: 'primary.main', whiteSpace: 'normal' }}
                            >
                                <Stack flex={1} flexDirection={'row'} gap={1} alignItems={'center'}>
                                    <Avatar
                                        sx={{
                                            backgroundColor: "#7C8883",
                                            width: 30,
                                            height: 30,
                                        }}
                                        alt={dat.workspace_name} variant="rounded"
                                    >
                                        <Typography>{avatarAlt(dat.workspace_name)}</Typography>
                                    </Avatar>
                                    <Typography
                                        textOverflow={"ellipsis"}
                                        fontSize={14}
                                        fontWeight={500}
                                        color={"#c5c5c5"}
                                    >
                                        {`You've been invited to ${dat.workspace_name} Workspace`}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ) :
                            <MenuItem>
                                <Stack flex={1} flexDirection={'row'} gap={1} alignItems={'center'}>
                                    <Typography
                                        textOverflow={"ellipsis"}
                                        fontSize={14}
                                        fontWeight={500}
                                        color={"#c5c5c5"}
                                    >
                                        {`There's no invitation for now`}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        }
                    </Menu>
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
                                setIsOpenModalBoard(true);
                                handleCloseC();
                            }}
                        >
                            <DashboardIcon
                                sx={{
                                    width: 16,
                                    height: 16,
                                    color: "#c5c5c5",
                                    marginRight: 1,
                                }}
                            />
                            <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={"#c5c5c5"}
                            >
                                Create board
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setIsOpenModalWorkspace(true);
                                handleCloseC();
                            }}
                            sx={{ borderTop: 1, borderColor: 'primary.main' }}
                        >
                            <PeopleIcon
                                sx={{
                                    width: 16,
                                    height: 16,
                                    color: "#c5c5c5",
                                    marginRight: 1,
                                }}
                            />
                            <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={"#c5c5c5"}
                            >
                                Create workspace
                            </Typography>
                        </MenuItem>
                    </Menu>
                    <Menu
                        id="basic-menu"
                        elevation={0}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
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
                        <Stack p={1.5} gap={1} flexDirection={'row'}>
                            <Avatar
                                sx={{
                                    backgroundColor: "primary.main",
                                    width: 46,
                                    height: 46,
                                    color: 'white',
                                }}
                                alt={dataUser?.username ?? "-"}
                            >
                                {avatarAlt(dataUser?.username ?? "A")}
                            </Avatar>
                            <Stack>
                                <Typography
                                    fontSize={14}
                                    fontWeight={500}
                                    color={"#c5c5c5"}
                                >
                                    {dataUser?.username ?? "-"}
                                </Typography>
                                <Typography
                                    fontSize={14}
                                    fontWeight={500}
                                    color={"#c5c5c5"}
                                >
                                    {dataUser?.email ?? "-"}
                                </Typography>
                            </Stack>
                        </Stack>
                        <MenuItem
                            onClick={() => {
                                openModalLogout();
                                handleClose();
                            }}
                            sx={{ borderTop: 1, borderColor: 'primary.main' }}
                        >
                            <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={"#c5c5c5"}
                            >
                                Logout
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", lg: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {newDrawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {
                            xs: "none",
                            sm: "none",
                            md: "none",
                            lg: "block",
                        },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            borderRight: 0,
                        },
                    }}
                    open
                >
                    {newDrawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1 }}>
                {/* <Container disableGutters sx={{ marginX: 0 }} maxWidth={'xl'}> */}
                {children}
                {/* </Container> */}
            </Box>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalLogout}
                onClose={closeModalLogout}
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
                        Logout
                    </DialogTitle>
                    {!isPhoneScreen &&
                        <IconButton
                            aria-label="close"
                            onClick={closeModalLogout}
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
                        Are you sure you want to logout and go back to login screen?
                    </Typography>
                </DialogContent>
                <DialogActions disableSpacing
                    sx={{ paddingX: isPhoneScreen ? 2.5 : 4.5, paddingBottom: isPhoneScreen ? 2.5 : 4.5, paddingTop: 3, flexDirection: isPhoneScreen ? 'column' : 'row' }}
                >
                    {isPhoneScreen &&
                        <Button
                            fullWidth={isPhoneScreen}
                            variant="outlined"
                            onClick={closeModalLogout}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>}
                    <Button
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={handleKeluar}
                        color="error"
                        sx={{
                            fontWeight: "bold",
                            marginLeft: isPhoneScreen ? 0 : 16,
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalClear}
                onClose={closeModalClear}
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
                        Clear Notifications
                    </DialogTitle>
                    {!isPhoneScreen &&
                        <IconButton
                            aria-label="close"
                            onClick={closeModalClear}
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
                        Are you sure you want to clear all notifications that you have right now?
                    </Typography>
                </DialogContent>
                <DialogActions disableSpacing
                    sx={{ paddingX: isPhoneScreen ? 2.5 : 4.5, paddingBottom: isPhoneScreen ? 2.5 : 4.5, paddingTop: 3, flexDirection: isPhoneScreen ? 'column' : 'row' }}
                >
                    {isPhoneScreen &&
                        <Button
                            fullWidth={isPhoneScreen}
                            variant="outlined"
                            onClick={closeModalClear}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>}
                    <Button
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={clear}
                        color="error"
                        sx={{
                            fontWeight: "bold",
                            marginLeft: isPhoneScreen ? 0 : 16,
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Clear Notifications
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalInv}
                onClose={closeModalInv}
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
                        Invitation
                    </DialogTitle>
                    {!isPhoneScreen &&
                        <IconButton
                            aria-label="close"
                            onClick={closeModalInv}
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
                        Hey there! You just got an invitation from {dataInv?.inviter_user_name} to join {dataInv?.workspace_name} Workspace. So, you are in or not?
                    </Typography>
                </DialogContent>
                <DialogActions disableSpacing
                    sx={{ paddingX: isPhoneScreen ? 2.5 : 4.5, paddingBottom: isPhoneScreen ? 2.5 : 4.5, paddingTop: 3, flexDirection: isPhoneScreen ? 'column' : 'row' }}
                >
                    {isPhoneScreen &&
                        <LoadingButton
                            loading={isLoading}
                            fullWidth={isPhoneScreen}
                            variant="outlined"
                            onClick={closeModalInv}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </LoadingButton>
                    }
                    <LoadingButton
                        loading={isLoading}
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={refuse}
                        color="error"
                        sx={{
                            fontWeight: "bold",
                            marginLeft: isPhoneScreen ? 0 : 1,
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Refuse
                    </LoadingButton>
                    <LoadingButton
                        loading={isLoading}
                        fullWidth={isPhoneScreen}
                        variant="contained"
                        onClick={accept}
                        color="buttongreen"
                        sx={{
                            fontWeight: "bold",
                            marginLeft: isPhoneScreen ? 0 : 1,
                            marginTop: isPhoneScreen ? 2 : 0,
                        }}
                    >
                        Accept
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
