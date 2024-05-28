import React from "react";
import { useAuth } from "@/context/authContext";
// import Router from "next/router";
import { useRouter } from 'next/navigation'
interface IPrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
    const { isAuthenticated } = useAuth();
    const Router = useRouter();
    React.useEffect(() => {
        if (!isAuthenticated) {
            Router.push("/");
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }
    return <React.Fragment>{children}</React.Fragment>;
};

export default PrivateRoute;
