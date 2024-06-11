import { Card, Stack, CardHeader, CardActions, IconButton, CardActionArea, Typography, Box, Chip, Tooltip, AvatarGroup, Avatar, Dialog, DialogTitle, DialogContent, useMediaQuery, useTheme, FormControlLabel, Checkbox } from "@mui/material";
import React, { useCallback, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import defaultAxios, { AxiosError } from "axios";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Swal from "sweetalert2";
import axios from "@/services/axios";
import { StarredResponse } from "@/constants/types";
import { useAuth } from "@/context/authContext";
import useCardActivity from "@/services/queries/useCardActivity";
import useCardMember from "@/services/queries/useCardMember";
import useCardChecklist from "@/services/queries/useCardChecklist";
import useCardComment from "@/services/queries/useCardComment";
import useCardCover from "@/services/queries/useCardCover";
import useCardDate from "@/services/queries/useCardDate";
import useCardLabel from "@/services/queries/useCardLabel";
import moment from "moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SubjectIcon from '@mui/icons-material/Subject';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import avatarAlt from "@/utils/avatarAlt";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListIcon from '@mui/icons-material/List';
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";

interface ICardListCardProps {
    id: number;
    namaCard: string;
    namaList: string;
    desc: string;
    refetch?: () => void;
    click: () => void;
}

const CardListCard = ({
    id,
    namaCard,
    namaList,
    refetch,
    desc,
    click,
}: ICardListCardProps) => {
    const theme = useTheme();
    const { data: dataCardActivity, refetch: refetchCardActivity } = useCardActivity(id);
    const { data: dataCardMember, refetch: refetchCardMember } = useCardMember(id);
    const { data: dataCardChecklist, refetch: refetchCardChecklist } = useCardChecklist(id);
    const { data: dataCardComment, refetch: refetchCardComment } = useCardComment(id);
    const { data: dataCardCover, refetch: refetchCardCover } = useCardCover(id);
    const { data: dataCardDate, refetch: refetchCardDate } = useCardDate(id);
    const { data: dataCardLabel, refetch: refetchCardLabel } = useCardLabel(id);
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const [isOpenModalListCard, setIsOpenModalListCard] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const closeModalListCard = () => {
        setIsOpenModalListCard(false);
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

    const refetchs = useCallback(
        async () => {
            try {
                refetchCardActivity();
                refetchCardMember();
                refetchCardChecklist();
                refetchCardComment();
                refetchCardCover();
                refetchCardDate();
                refetchCardLabel();
            } catch (error) {
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, refetchCardActivity, refetchCardChecklist, refetchCardComment, refetchCardCover, refetchCardDate, refetchCardLabel, refetchCardMember],
    );

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'secondary.main',
                borderRadius: 2,
                minWidth: 200,
            }}
        >
            <CardActionArea onClick={() => setIsOpenModalListCard(true)}>
                {dataCardCover && dataCardCover.length > 0 &&
                    <Stack px={1.5} py={2} whiteSpace={'normal'} bgcolor={dataCardCover[0].cover}>
                    </Stack>
                }
                <Stack py={1}>
                    {dataCardLabel && dataCardLabel.length > 0 &&
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(6, 1fr)"
                            gap={0.6}
                            px={1.5}
                        >
                            {dataCardLabel.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'}>
                                    <Chip size="small" label={""} sx={{ backgroundColor: dat.color, color: 'white', borderRadius: 1, width: 35, height: 10 }} />
                                </Stack>
                            )}
                        </Box>
                    }
                    <Stack px={1.5} py={0.5} whiteSpace={'normal'}>
                        <Typography fontSize={14} color={"white"}>{namaCard}</Typography>
                    </Stack>
                    <Stack px={1.5} py={0.5} flexDirection={'row'} gap={0.5} alignItems={'center'} justifyContent={'space-between'}>
                        <Stack flexDirection={'row'} gap={0.5} alignItems={'center'}>
                            {dataCardDate && dataCardDate.length > 0 && <Tooltip
                                title={`This card is due on ${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('DD MMM YYYY')}`}
                                slotProps={{
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
                                }}
                            >
                                <Chip icon={<AccessTimeIcon />} size="small" label={`${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('MMM DD')}`} sx={{ backgroundColor: "buttonyellow.main", color: 'black', borderRadius: 1 }} />
                            </Tooltip>}
                            {desc && <Tooltip
                                title="This card has description"
                                slotProps={{
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
                                }}
                            >
                                <SubjectIcon sx={{ color: 'white', width: 20, height: 20 }} />
                            </Tooltip>
                            }
                            {dataCardChecklist && dataCardChecklist.length > 0 && <Tooltip
                                title="This card has checklist"
                                slotProps={{
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
                                }}
                            >
                                <CheckBoxOutlinedIcon sx={{ color: 'white', width: 20, height: 20 }} />
                            </Tooltip>
                            }
                        </Stack>

                        {dataCardMember && dataCardMember.length > 0 &&
                            <AvatarGroup max={2} sx={{
                                '& .MuiAvatar-root': { width: 32, height: 32, borderColor: 'primary.main', },
                            }}>
                                {dataCardMember.map((dat, idx) =>
                                    <Tooltip key={String(idx)} title={dat?.member_username ?? "-"} slotProps={{
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
                                            alt={dat?.member_username ?? "-"}
                                        >
                                            {avatarAlt(dat?.member_username ?? "A")}
                                        </Avatar>
                                    </Tooltip>
                                )}
                            </AvatarGroup>
                        }
                    </Stack>
                </Stack>
            </CardActionArea>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalListCard}
                onClose={closeModalListCard}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: "768px",
                        border: 0,
                        backgroundColor: 'secondary.main'
                    },
                }}
            >
                {dataCardCover && dataCardCover.length > 0 &&
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        padding={4.5}
                        bgcolor={dataCardCover[0].cover}
                    >
                        <DialogTitle
                            sx={{ padding: 0 }}
                            fontSize={32}
                            fontWeight={700}
                        >
                        </DialogTitle>
                    </Stack>
                }
                <IconButton
                    aria-label="close"
                    onClick={closeModalListCard}
                    sx={{
                        color: 'white',
                        position: 'absolute',
                        top: 5,
                        right: 5,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent
                    sx={{
                        px: 3,
                        py: 2,
                    }}
                >
                    <Stack flexDirection={"column"} gap={3} pb={2} flex={1}>
                        <Stack flexDirection={"row"} gap={1}>
                            <CreditCardIcon sx={{ color: 'white' }} />
                            <Stack gap={0.5} flex={1}>
                                <Typography
                                    fontWeight={600}
                                    fontSize={16}
                                    color={'white'}
                                >
                                    {namaCard}
                                </Typography>
                                <Typography
                                    fontSize={12}
                                    color={'white'}
                                >
                                    in list {namaList}
                                </Typography>
                                <Stack gap={2} mt={3}>
                                    <Stack flexDirection={'row'} gap={3} flex={1}>
                                        <Stack gap={0.5}>
                                            <Typography
                                                fontWeight={600}
                                                fontSize={12}
                                                color={'white'}
                                            >
                                                Members
                                            </Typography>
                                            <Stack flexDirection={'row'}>
                                                {dataCardMember && dataCardMember.length > 0 &&
                                                    <Box
                                                        display="grid"
                                                        gridTemplateColumns="repeat(8, 1fr)"
                                                        gap={1}
                                                    >
                                                        {dataCardMember.map((dat, idx) =>
                                                            <Tooltip key={String(idx)} title={dat?.member_username ?? "-"} slotProps={{
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
                                                                        borderColor: 'primary.main',
                                                                        border: 1,
                                                                    }}
                                                                    alt={dat?.member_username ?? "-"}
                                                                >
                                                                    {avatarAlt(dat?.member_username ?? "A")}
                                                                </Avatar>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                }
                                            </Stack>
                                        </Stack>
                                        <Stack gap={0.5}>
                                            <Typography
                                                fontWeight={600}
                                                fontSize={12}
                                                color={'white'}
                                            >
                                                Labels
                                            </Typography>
                                            {dataCardLabel && dataCardLabel.length > 0 &&
                                                <Box
                                                    display="grid"
                                                    gridTemplateColumns="repeat(4, 1fr)"
                                                    gap={0.7}
                                                >
                                                    {dataCardLabel.map((dat, idx) =>
                                                        <Stack key={String(idx)} flexDirection={'row'}>
                                                            <Chip label={dat.label_title} sx={{ backgroundColor: dat.color, color: 'white', borderRadius: 1 }} />
                                                        </Stack>
                                                    )}
                                                </Box>
                                            }
                                        </Stack>
                                    </Stack>
                                    <Stack gap={0.5}>
                                        <Typography
                                            fontWeight={600}
                                            fontSize={12}
                                            color={'white'}
                                        >
                                            Due date
                                        </Typography>
                                        {dataCardDate && dataCardDate.length > 0 &&
                                            <Stack flexDirection={'row'}>
                                                <Chip icon={<AccessTimeIcon />} label={`${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('DD MMMM YYYY')}`} sx={{ backgroundColor: "buttonyellow.main", color: 'black', borderRadius: 1 }} />
                                            </Stack>}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack flexDirection={"row"} gap={1}>
                            <SubjectIcon sx={{ color: 'white' }} />
                            <Stack gap={0.5} flex={1}>
                                <Typography
                                    fontWeight={600}
                                    color={'white'}
                                >
                                    Description
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack gap={1.5}>
                            <Stack flexDirection={"row"} gap={1}>
                                <CheckBoxOutlinedIcon sx={{ color: 'white' }} />
                                <Stack gap={0.5} flex={1}>
                                    <Typography
                                        fontWeight={600}
                                        color={'white'}
                                    >
                                        Checklist
                                    </Typography>
                                </Stack>
                            </Stack>
                            {dataCardChecklist && dataCardChecklist.length > 0 && dataCardChecklist.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'} ml={2} gap={1}>
                                    <CustomCheckbox
                                        sx={{ padding: 0 }}
                                        // onChange={handleClickAllProduct}
                                        checked={
                                            dat.status_id === 1 ? false : true
                                        }
                                    />
                                    <Typography
                                        fontWeight={500}
                                        color={'white'}
                                    >
                                        {dat.checklist_title}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                        <Stack gap={1.5}>
                            <Stack flexDirection={"row"} gap={1}>
                                <ListIcon sx={{ color: 'white' }} />
                                <Stack gap={0.5} flex={1}>
                                    <Typography
                                        fontWeight={600}
                                        color={'white'}
                                    >
                                        Activity
                                    </Typography>
                                </Stack>
                            </Stack>

                            {dataCardActivity && dataCardActivity.length > 0 && dataCardActivity.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'} gap={1}>

                                    <Avatar
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            width: 32, height: 32,
                                            color: 'white',
                                            borderColor: 'primary.main',
                                            border: 1,
                                        }}
                                        alt={dat.user_username ?? "-"}
                                    >
                                        {avatarAlt(dat.user_username ?? "A")}
                                    </Avatar>
                                    <Stack gap={0.5} flex={1}>
                                        <Stack flexDirection={isPhoneScreen ? 'column' : 'row'} gap={0.5}>
                                            <Typography
                                                fontWeight={600}
                                                fontSize={14}
                                                color={'white'}
                                            >
                                                {`${dat.user_username}`}
                                            </Typography>
                                            <Typography
                                                fontSize={14}
                                                color={'white'}
                                            >
                                                {`${dat.detailed}`}
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            fontSize={12}
                                            color={'white'}
                                        >
                                            {`${moment(dat.created_at, 'YYYY-MM-DD').format('DD MMMM YYYY')}`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default CardListCard;
