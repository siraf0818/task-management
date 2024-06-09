import { Card, Stack, CardHeader, CardActions, IconButton, CardActionArea } from "@mui/material";
import React, { useCallback } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import defaultAxios, { AxiosError } from "axios";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Swal from "sweetalert2";
import axios from "@/services/axios";
import { StarredResponse } from "@/constants/types";
import { useAuth } from "@/context/authContext";

interface ICardBoardProps {
    id: number;
    namaCard: string;
    isFavorite: boolean;
    refetch?: () => void;
    click: () => void;
}

const CardBoard = ({
    id,
    namaCard,
    isFavorite,
    refetch,
    click,
}: ICardBoardProps) => {
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

    const star = useCallback(
        async () => {
            if (isFavorite) {
                try {
                    const { data } = await axios.delete<StarredResponse>(
                        `users/star/${id}`
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
                        board_id: id,
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
        [handleErrorResponse, id, isFavorite, refetch],
    );

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'primary.main',
                borderRadius: 1,
                minWidth: 200,
            }}
        >
            <CardActionArea onClick={click}>
                <CardHeader
                    color="white"
                    title={namaCard}
                    titleTypographyProps={{ fontWeight: "600", fontSize: 16, color: 'white' }}
                />
                <CardActions disableSpacing sx={{ justifyContent: 'flex-end' }}>
                    <Stack>
                        {isFavorite ?
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    star();
                                }}
                            >
                                <FavoriteIcon color="error" />
                            </IconButton> :
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    star();
                                }}
                            >
                                <FavoriteOutlinedIcon color="error" />
                            </IconButton>
                        }
                    </Stack>
                </CardActions>
            </CardActionArea>
        </Card>
    );
};

export default CardBoard;
