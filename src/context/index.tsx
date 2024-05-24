import React, { ReactNode } from "react";
import { AuthProvider } from "./authContext";

interface IindexProps {
    children: ReactNode;
}

const AppProvider = ({ children }: IindexProps) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

export default AppProvider;
