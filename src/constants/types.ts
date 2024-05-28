export interface LoginBody {
  email: string;
  password: string;
}

export interface RegistrasiForm {
  nama: string;
  username: string;
  email: string;
  no_telp: string;
  password: string;
  passwordUlang: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  checkToken: (token: string) => void;
  login: (values: LoginBody) => void;
  logout: () => void;
  register: (values: RegistrasiForm) => void;
  handleRegistered: () => void;
  handleAuthenticated: (value: boolean) => void;
  setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetToken: (token: any) => Promise<void>;
}

export interface CheckToken {
  code: number;
  message: string;
}

export interface LogoutResponse {
  code: number;
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  // code: number;
  // message: string;
  // data: {
  //   token: string;
  // };
}

export interface RegistrasiResponse {
  code: number;
  message: string;
  data: {
    nama: string;
    username: string;
    email: string;
    alamat: string;
    no_telp: string;
    role: string;
    status: number;
    gambar: string | null;
    updated_at: string;
    created_at: string;
    id: number;
    token: string;
  };
}

export interface ErrorsFieldResponse {
  field: string;
  message: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  data: {
    errors: {
      field: string;
      message: string;
    };
  };
}

export type DefaultResponse = {
  code: number;
  message: string;
};

export type UserResponse = {
  code: number;
  data: {
    userId: number;
    nama: string;
    username: string;
    email: string;
  };
};
