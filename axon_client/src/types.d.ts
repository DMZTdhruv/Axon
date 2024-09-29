export type TMenuItem = {
  _id: string;
  icon: string;
  title: string;
  url: string;
};
export interface IRoutes {
  _id: string;
  title: string;
  workspace: string;
  parentPageId: string | null;
  childPageId: string | null;
}
export type TWorkspaceItems = TMenuItem & {
  workSpace: string;
  parentPageId: null | string;
  childPageId: null | string;
  content?: [];
  subPages: TWorkspaceItems[];
};

export type TUser = {
  email: string;
  username: string;
  password: string;
  userImage?: string;
};

export type TAuthUser = {
  _id: string;
  userImage?: string;
  username: string;
};

export type TResponse = {
  message: string;
  success: boolean;
  data: TAuthUser;
};

export type TNavigationWorkspaceContent = {
	_id: string;
	title: string | undefined;
	cover: string | undefined;
	icon: string | undefined;
	workspaceType: string;
};

