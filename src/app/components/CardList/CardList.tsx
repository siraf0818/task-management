import { Card, Stack, CardHeader, CardActions, IconButton, CardActionArea, Box, Typography, Button, TextField } from "@mui/material";
import React, { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import defaultAxios, { AxiosError } from "axios";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Swal from "sweetalert2";
import axios from "@/services/axios";
import { DefaultResponse, StarredResponse } from "@/constants/types";
import { useAuth } from "@/context/authContext";
import { mdiPlus } from '@mdi/js';
import Icon from "@mdi/react";
import useListCard from "@/services/queries/useListCard";
import CardListCard from "../CardListCard/CardListCard";
import CloseIcon from '@mui/icons-material/Close';

interface ICardListProps {
    id: number;
    namaCard: string;
    namaList: string;
    refetch?: () => void;
    click: () => void;
}

const CardList = ({
    id,
    namaCard,
    namaList,
    refetch,
    click,
}: ICardListProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const { data: dataListCard, refetch: refetchListCard } = useListCard(id);
    const [isNewCard, setIsNewCard] = useState<boolean>(false);
    const [titleCard, setTitleCard] = useState<string>();

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        updateListTitle();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
            updateListTitle();
        }
    };

    const handleChangeCard = (event: ChangeEvent<HTMLInputElement>) => {
        setTitleCard(event.target.value);
    };

    const handleErrorResponse = useCallback((error: any) => {
        if (defaultAxios.isAxiosError(error)) {
            const serverError = error as AxiosError<any>;
            if (serverError && serverError.response) {
                console.log(`serverError`, serverError.response);
                if (serverError.response!.status === 400) {
                    Swal.fire({
                        title: "Something's Wrong!",
                        text: `${serverError.response.data.data.error.message}`,
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

    const newCard = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `list/${id}/card`, {
                    title: titleCard,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchListCard();
                }
                setLoading(false);
                setIsNewCard(false);
                setTitleCard("");
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, id, refetchListCard, titleCard],
    );

    const updateListTitle = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `list/${id}/title`, {
                    title: title ?? (namaCard),
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetch && refetch();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, id, namaCard, refetch, title],
    );

    const deleteList = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `list/${id}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetch && refetch();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, id, refetch],
    );

    React.useEffect(() => {
        if (!title && namaCard) {
            setTitle(namaCard);
        }
    }, [namaCard, title]);

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                borderRadius: 2,
                width: 256,
                px: 1.5,
                py: 2,
                height: '100%'
            }}
        >
            <Stack>
                {isEditing ?
                    <TextField
                        value={title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        inputProps={{ style: { paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'white', borderRadius: 8 } }}
                        sx={{
                            '& .MuiInputBase-input': {
                                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                                padding: 0,
                                border: 0,
                            },
                            mb: 1,
                            ml: 0.3,
                        }}
                    /> :
                    <Stack mb={1.5} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography ml={0.3} mt={0.3} fontWeight={"500"} color={"primary.contrastText"}
                            onClick={handleTextClick} >{namaCard}</Typography>
                        <IconButton
                            onClick={deleteList}
                            sx={{ p: 0.5 }}
                        >
                            <CloseIcon color="error" />
                        </IconButton>
                    </Stack>
                }
                <Stack gap={1} sx={{
                    display: 'flex',
                    overflowY: 'auto',
                    whiteSpace: 'nowrap',
                    maxHeight: "67vh",
                }}>
                    {dataListCard && dataListCard.map((dat, idx) =>
                        <CardListCard namaList={namaList} desc={dat.description} key={String(idx)} id={dat.card_id} refetch={refetch} namaCard={dat.title} click={() => console.log('pressed')} />
                    )}
                </Stack>

                {isNewCard ?
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: 2,
                            height: '100%',
                            mt: 1.5,
                        }}
                    >
                        <Stack gap={1} >
                            <TextField
                                value={titleCard}
                                onChange={handleChangeCard}
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
                                    onClick={newCard} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                    Add card
                                </Button>
                                <Button fullWidth
                                    onClick={() => { setIsNewCard(false); setTitleCard("") }} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="error">
                                    Close
                                </Button>
                            </Stack>
                        </Stack>
                    </Box> :
                    <Button
                        onClick={() => setIsNewCard(true)} sx={{ fontSize: 12, height: 35, minWidth: 200, mt: 1.5 }} variant="contained" color="secondary" startIcon={
                            <Icon path={mdiPlus} size={1} />
                        }>
                        Add card
                    </Button>}
            </Stack>
        </Box>
    );
};

export default CardList;
