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
  workspaceId: number;
  boardId: number;
  checkToken: (token: string) => void;
  login: (values: LoginBody) => void;
  logout: () => void;
  register: (values: RegistrasiForm) => void;
  handleRegistered: () => void;
  handleAuthenticated: (value: boolean) => void;
  setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkspaceId: React.Dispatch<React.SetStateAction<number>>;
  setBoardId: React.Dispatch<React.SetStateAction<number>>;
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

export interface StarredResponse {
  message: string;
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
  errno: number;
  message: string;
  insertId: number;
  boardId: number;
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
  role_id: number;
  role_name: string;
};

export type TWorkspace = {
  membership_id: number;
  workspace_id: number;
  role_id: number;
  workspace_name: string;
  type_id: number;
  workspace_type: string;
  visibility_id: number;
  workspace_visibility: string;
  role_name: string;
  member_count: number;
  recent_boards: {
    id: number;
    owner_id: number;
    board_title: string;
    background: number;
    visibility_id: number;
    workspace_id: number;
    is_starred: number;
  }[];
};

export type GetWorkspaceResponse = TWorkspace[];

export type GetWorkspaceDetailResponse = {
  id: number;
  workspace_name: string;
  type_id: number;
  type_name: string;
  description: string;
  member_count: number;
  user_role_on_workspace: string;
};

export type GetRecentBoardsResponse = {
  board_id: number;
  board_title: string;
  workspace_id: number;
  workspace_name: string;
  is_starred: number;
}[];

export type GetWorkspaceBoardsResponse = {
  board_id: number;
  board_title: string;
  owner_id: number;
  owner_username: string;
  background: number;
  background_name: string;
  visibility_id: number;
  visibility_name: string;
  workspace_id: number;
  workspace_name: string;
  is_starred: number;
}[];

export type GetWorkspaceMembersResponse = {
  membership_id: number;
  user_id: number;
  user_username: string;
  user_email: string;
  role_id: number;
  role_name: string;
}[];

export type TWType = {
  id: number;
  name: string;
};

export type GetWorkspaceTypesResponse = TWType[];

export type TUser = {
  id: number;
  email: string;
  username: string;
  bio: string;
};

export type GetAllUsersResponse = TUser[];

export type TBVisibility = {
  id: number;
  name: string;
};

export type GetBoardVisibilitiesResponse = TBVisibility[];

export type TUInvitation = {
  invitation_id: number;
  inviter_user_id: number;
  inviter_user_name: string;
  workspace_id: number;
  workspace_name: string;
  type_id: number;
  workspace_type: string;
};

export type GetWorkspaceInvitationsResponse = TUInvitation[];

export type TNotif = {
  id: number;
  user_id: number;
  notification: string;
};

export type GetNotificationsResponse = TNotif[];

export type TBoard = {
  id: number;
  owner_id: number;
  board_title: string;
  background: string;
  visibility_id: number | null;
  workspace_id: number;
  owner_username: string;
  visibility_name: string;
  background_name: string | null;
  workspace_name: string;
  is_starred: number;
};

export type GetBoardResponse = TBoard[];

export type TBCollaborator = {
  collaborator_id: number;
  user_id: number;
  user_username: string;
  user_email: string;
  privilege_id: number;
  privilege_name: string;
};

export type GetBoardCollaboratorsResponse = TBCollaborator[];

export type GetStarredBoardsResponse = {
  board_id: number,
  board_title: string,
  workspace_id: number,
  workspace_name: string
}[];

export type GetBoardsCollaboratorResponse = {
  collaborator_id: number,
  user_id: number,
  user_username: string,
  user_email: string,
  privilege_id: number,
  privilege_name: string,
  collaborator_created_at: string,
  collaborator_updated_at: string
}[];

export type GetWorkspaceInvitationResponse = {
  invitation_id: number,
  inviter_user_id: number,
  inviter_user_name: string,
  workspace_id: number,
  workspace_name: string,
  type_id: number,
  workspace_type: string,
  invitation_created_at: string,
  invitation_updated_at: string
}[];
