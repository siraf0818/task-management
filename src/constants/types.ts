export interface LoginBody {
  email: string;
  password: string;
}

export interface RegistrasiForm {
  username: string;
  email: string;
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
  message: string;
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

export type GetUserDataResponse = {
  user_id: number;
  email: string;
  username: string;
  bio: string;
  user_created_at: string;
  user_updated_at: string;
  role_id: number;
  role_name: string;
};

export type GetWorkspaceResponse = {
  membership_id: number;
  workspace_id: number;
  role_id: number;
  workspace_name: string;
  type_id: number;
  workspace_type: string;
  visibility_id: number;
  workspace_visibility: string;
  role_name: string;
  membership_created_at: string;
  membership_updated_at: string;
}[];

export type GetRecentBoardsResponse = {
  board_id: number;
  board_title: string;
  workspace_id: number;
  workspace_name: string;
}[];
