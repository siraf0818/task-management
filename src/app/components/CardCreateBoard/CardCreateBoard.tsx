import { Card, Box, Typography, Stack, CardHeader, CardActions, IconButton, CardActionArea } from "@mui/material";
import React, { useCallback } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';

interface ICardCreateBoardProps {
    namaCard: string;
    create: () => void;
}

const CardCreateBoard = ({
    namaCard,
    create,
}: ICardCreateBoardProps) => {
    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'secondary.main',
                borderRadius: 1,
                minWidth: 200,
            }}
        >
            <CardActionArea onClick={create} sx={{ height: '100%' }}>
                <CardHeader
                    color="white"
                    title={namaCard}
                    titleTypographyProps={{ fontWeight: "600", fontSize: 16, color: 'white', textAlign: 'center' }}
                />
            </CardActionArea>
        </Card>
    );
};

export default CardCreateBoard;
