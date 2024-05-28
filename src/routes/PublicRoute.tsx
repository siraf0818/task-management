import React from "react";
import { useAuth } from "@/context/authContext";
import Router from "next/router";
import { useRouter } from 'next/navigation'
interface IPublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: IPublicRouteProps) => {
    const { isAuthenticated } = useAuth();
    const Router = useRouter();

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
