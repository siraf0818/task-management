import React, { ReactNode } from "react";
import { AuthProvider } from "./authContext";
import { ModalProvider } from "./modalContext";

interface IindexProps {
    children: ReactNode;
}

const AppProvider = ({ children }: IindexProps) => {
    return (
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    );
};

export default AppProvider;
