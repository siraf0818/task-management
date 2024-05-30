'use client';
import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation'
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import HistoryIcon from "@mui/icons-material/History";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import PaymentsIcon from "@mui/icons-material/Payments";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DashboardIcon from "@mui/icons-material/dashboard";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
    mdiPackageVariant,
} from "@mdi/js";
import Link from "next/link";
import { Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, Menu, MenuItem } from "@mui/material";
import avatarAlt from "@/utils/avatarAlt";
import { useAuth } from "@/context/authContext";
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

interface Props {
    children: React.ReactNode;
}

enum Expand {
    Workspace = "WORKSPACE",
}

type IExpanded = Expand;

export default function PageLayout(props: Props) {
    const [isOpenModalLogout, setIsOpenModalLogout] = React.useState(false);
    const { logout, isLoading } = useAuth();

    const handleKeluar = () => {
        logout();
        closeModalLogout();
    };

    const openModalLogout = () => setIsOpenModalLogout(true);
    const closeModalLogout = () => setIsOpenModalLogout(false);
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
    const [expanded, setExpanded] = React.useState<IExpanded | false>(Expand.Workspace);

    const handleExpand = (param: IExpanded) => {
        if (param === expanded) {
            setExpanded(false);
        } else if (param === Expand.Workspace) {
            localStorage.setItem("expandWorkspace", "true");
            setExpanded(param);
        }
    };

    const drawerWidth = 242;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

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
                    <ListItemButton
                        // selected={
                        //     pathName === "/workspace/boards" ||
                        //     pathName === "/workspace/highlights" ||
                        //     pathName === "/workspace/members" ||
                        //     pathName === "/workspace/settings"
                        // }
                        onClick={() => handleExpand(Expand.Workspace)}
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
                            alt={"Workspace"} variant="rounded"
                        >
                            <Typography>{avatarAlt("Workspace")}</Typography>
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
                                    Workspace
                                </Typography>
                            }
                        />
                        {expanded === Expand.Workspace ? (
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
                        in={expanded === Expand.Workspace}
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
                                component={Link}
                                href="/workspace/boards"
                                selected={
                                    pathName === "/workspace/boards"
                                }
                                sx={{
                                    borderRadius: 2,
                                    paddingY: 1,
                                    gap: 1,
                                    "&.Mui-selected": {
                                        backgroundColor:
                                            "secondary.main",
                                    },
                                }}
                            >
                                <DashboardIcon
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color:
                                            pathName === "/workspace/boards"
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
                                                        "/workspace/boards"
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
                                component={Link}
                                href="/workspace/highlights"
                                selected={
                                    pathName === "/workspace/highlights"
                                }
                                sx={{
                                    borderRadius: 2,
                                    paddingY: 1,
                                    gap: 1,
                                    "&.Mui-selected": {
                                        backgroundColor:
                                            "secondary.main",
                                    },
                                }}
                            >
                                <FavoriteBorderIcon
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color:
                                            pathName === "/workspace/highlights"
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
                                                        "/workspace/highlights"
                                                        ? "secondary.main"
                                                        : "#7C8883",
                                            }}
                                        >
                                            Highlights
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                href="/workspace/members"
                                selected={
                                    pathName === "/workspace/members"
                                }
                                sx={{
                                    borderRadius: 2,
                                    paddingY: 1,
                                    gap: 1,
                                    "&.Mui-selected": {
                                        backgroundColor:
                                            "secondary.main",
                                    },
                                }}
                            >
                                <PeopleOutlineIcon
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color:
                                            pathName === "/workspace/members"
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
                                                        "/workspace/members"
                                                        ? "secondary.main"
                                                        : "#7C8883",
                                            }}
                                        >
                                            Members
                                        </Typography>
                                    }
                                />
                                <Icon path={mdiPlus} size={1} color={pathName === "/workspace/members"
                                    ? "secondary.main"
                                    : "#7C8883"} />
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                href="/workspace/settings"
                                selected={
                                    pathName === "/workspace/settings"
                                }
                                sx={{
                                    borderRadius: 2,
                                    paddingY: 1,
                                    gap: 1,
                                    "&.Mui-selected": {
                                        backgroundColor:
                                            "secondary.main",
                                    },
                                }}
                            >
                                <SettingsIcon
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color:
                                            pathName === "/workspace/settings"
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
                                                        "/workspace/settings"
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
                        ? undefined
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
                        <Stack flexDirection={'row'} alignItems={'center'} >
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { lg: "none" } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                {"Project Manager"}
                            </Typography>
                        </Stack>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleClick}
                        // sx={{ mr: 2, display: { lg: "none" } }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: "secondary.main",
                                    width: 36,
                                    height: 36,
                                }}
                                alt={"Bagus"}
                            // src={"Bagus"}
                            >
                                {avatarAlt("Bagus")}
                            </Avatar>
                        </IconButton>
                    </Stack>
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
                                borderColor: "#A8B4AF",
                                marginTop: theme.spacing(1),
                                width: "190px",
                                "& .MuiMenuItem-root": {
                                    padding: "12px, 24px, 12px, 24px",
                                },
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                openModalLogout();
                                handleClose();
                            }}
                        >
                            <Typography
                                fontWeight={500}
                                color={"#464E4B"}
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
                <Container disableGutters maxWidth="xl">
                    {children}
                </Container>
            </Box>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
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
                    padding={4.5}
                >
                    <DialogTitle
                        sx={{ padding: 0 }}
                        fontSize={32}
                        fontWeight={700}
                    >
                        Konfirmasi Keluar
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={closeModalLogout}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <DialogContent
                    sx={{
                        borderTop:
                            "1px solid var(--text-primary-thin, #A8B4AF)",
                        paddingTop: 4.5,
                        paddingX: 4.5,
                    }}
                >
                    <Typography color={"#464E4B"}>
                        Anda yakin ingin keluar dari akun dan kembali ke halaman
                        masuk?
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{ paddingX: 4.5, paddingBottom: 4.5, paddingTop: 3 }}
                >
                    <Button
                        variant="outlined"
                        onClick={closeModalLogout}
                        color="primary"
                        sx={{
                            fontWeight: "bold",
                        }}
                    >
                        Kembali
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleKeluar}
                        color="error"
                        sx={{
                            fontWeight: "bold",
                        }}
                        style={{ marginLeft: 16 }}
                    >
                        Konfirmasi Keluar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
