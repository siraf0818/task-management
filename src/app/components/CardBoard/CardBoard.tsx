import { Card, Box, Typography, Stack, CardHeader, CardActions, IconButton, CardActionArea } from "@mui/material";
import React from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

interface ICardBoardProps {
    namaCard: string;
    isFavorite: boolean;
}

const CardBoard = ({
    namaCard,
    isFavorite,
}: ICardBoardProps) => {
    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'primary.main',
                borderRadius: 1,
                minWidth: 200,
            }}
        >
            <CardActionArea  >
                <CardHeader
                    color="white"
                    title={namaCard}
                    titleTypographyProps={{ fontWeight: "600", fontSize: 16, color: 'white' }}
                />
                <CardActions disableSpacing sx={{ justifyContent: 'flex-end' }}>
                    <Stack sx={{ padding: 1 }}>
                        {isFavorite ?
                            <FavoriteIcon color="error" /> :
                            // <FavoriteOutlinedIcon color="error" />
                            <FavoriteIcon color="primary" />
                        }
                    </Stack>
                </CardActions>
            </CardActionArea>
        </Card>
    );
};

export default CardBoard;
