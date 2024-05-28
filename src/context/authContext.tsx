import { Cookies } from "react-cookie";
import defaultAxios, { AxiosError } from "axios";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { tokenKey } from "../constants/common";
import {
    AuthState,
    CheckToken,
    LogoutResponse,
    LoginBody,
    LoginResponse,
    UserResponse,
    RegistrasiForm,
    RegistrasiResponse,
} from "../constants/types";
import axios from "../services/axios";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import Router from "next/router";
import { Password } from "@mui/icons-material";

interface IAuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [isRegistered, setRegistered] = useState<boolean>(false);
    const [isPreparingApp, setPreparingApp] = useState<boolean>(true);
    const [isLoading, setLoading] = useState<boolean>(false);
    const cookies = useMemo(() => new Cookies(), []);
    const queryClient = useQueryClient();

    const handleRemoveToken = useCallback(async () => {
        try {
            await cookies.remove(tokenKey);
        } catch (error) {
            throw error;
        }
    }, [cookies]);

    const handleErrorResponse = useCallback((error: any) => {
        if (defaultAxios.isAxiosError(error)) {
            const serverError = error as AxiosError<any>;
            if (serverError && serverError.response) {
                console.log(`serverError`, serverError.response);
                if (serverError.response!.status === 400) {
                    Swal.fire({
                        title: "Terjadi Kesalahan!",
                        text: `${serverError.response.data.data.errors.message}`,
                        icon: "error",
                        confirmButtonColor: "#45A779",
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
                        title: "Terjadi Kesalahan!",
                        text: `Ada error validasi`,
                        icon: "error",
                        confirmButtonColor: "#45A779",
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
                        title: "Terjadi Kesalahan!",
                        text: `${serverError.response.data.message}`,
                        icon: "error",
                        confirmButtonColor: "#45A779",
                        customClass: {
                            container: "my-swal",
                        },
                    });
                    console.log("", `${serverError.response.data.data}`, [
                        { text: "OK" },
                    ]);
                }
            } else {
                console.log("", `Terjadi kesalahan! Silahkan coba lagi.`, [
                    { text: "OK" },
                ]);
            }
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            setAuthenticated(false);
            handleRemoveToken();
            queryClient.clear();
            setLoading(false);
        } catch (error) {
            handleErrorResponse(error);
            setLoading(false);
        }
    }, [handleErrorResponse, handleRemoveToken, queryClient]);

    const checkToken = useCallback(
        async (token: string) => {
            try {
                if (token) {
                    setAuthenticated(true);
                }
            } catch (error) {
                handleErrorResponse(error);
                setAuthenticated(false);
                handleRemoveToken();
                queryClient.clear();
            }
        },
        [handleErrorResponse, handleRemoveToken, logout, queryClient],
    );

    const loadResourcesAndDataAsync = useCallback(async () => {
        try {
            const token = await cookies.get(tokenKey);
            if (token) {
                await checkToken(token);
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setPreparingApp(false);
        }
    }, [checkToken, cookies]);

    useEffect(() => {
        loadResourcesAndDataAsync();
    }, [loadResourcesAndDataAsync]);

    const handleSetToken = useCallback(
        async (token: any) => {
            try {
                cookies.set(tokenKey, token, {
                    path: "/",
                });
            } catch (error) {
                throw error;
            }
        },
        [cookies],
    );

    const handleRegistered = () => {
        setRegistered(true);
    };

    const handleAuthenticated = (value: boolean) => {
        setAuthenticated(value);
    };

    const login = useCallback(
        async (values: LoginBody) => {
            console.log(values);
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("email", values.email);
                formData.append("password", values.password);
                console.log(formData);
                const { data } = await axios.post<LoginResponse>(
                    "users/login", {
                    email: values.email,
                    password: values.password,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                console.log(`data`, data);
                if (data.accessToken) {
                    setAuthenticated(true);
                    handleSetToken(data.accessToken);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, handleSetToken],
    );

    const register = useCallback(
        async (values: RegistrasiForm) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("nama", values.nama);
                formData.append("username", values.username);
                formData.append("email", values.email);
                formData.append("password", values.password);
                const { data } = await axios.post<RegistrasiResponse>(
                    "/api/register",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );
                if (data.code === 200) {
                    setAuthenticated(true);
                    handleSetToken(data.data.token);
                    Router.push("/home");
                    // checkToken(data.data.token);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, handleSetToken],
    );

    const value = useMemo(
        () => ({
            isAuthenticated,
            isLoading,
            isRegistered,
            checkToken,
            login,
            logout,
            register,
            handleRegistered,
            setRegistered,
            handleAuthenticated,
            handleSetToken,
        }),
        [
            isAuthenticated,
            isLoading,
            isRegistered,
            checkToken,
            login,
            logout,
            register,
            handleSetToken,
        ],
    );

    if (isPreparingApp) return null;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

export { AuthContext, AuthProvider, useAuth };
