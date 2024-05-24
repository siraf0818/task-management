import React from "react";
import { useAuth } from "@/context/authContext";
import Router from "next/router";

interface IPublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: IPublicRouteProps) => {
    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        if (isAuthenticated) {
            Router.push("/home");
        }
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return null;
    }

    return <React.Fragment>{children}</React.Fragment>;
};

export default PublicRoute;
