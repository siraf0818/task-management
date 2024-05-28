import Backdrop from "@mui/material/Backdrop";
import React from "react";
import Image from "next/image";

interface ILoadingOverlayProps {
    open: boolean;
}

const LoadingOverlay = ({ open }: ILoadingOverlayProps) => {
    return (
        <Backdrop
            sx={{
                color: "primary.main",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
        >
            {/* <Image
                priority
                src="/images/LoadingUlo.gif"
                width={100}
                height={100}
                alt="loading..."
                objectFit="contain"
            /> */}
        </Backdrop>
    );
};

export default LoadingOverlay;
