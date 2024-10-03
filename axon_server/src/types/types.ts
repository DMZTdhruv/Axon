export type TUser = {
	_id: string,
	email: string;
	username: string;
	password: string;
	userImage: string,
};

export type TCreateWorkspaceControllerRequest = {
   _id: string,
   workspace: 'main' | 'axonverse',
   createdBy: string,
}

export type TCreateWorkspaceService = {
   _id: string,
   workspace: 'main' | 'axonverse',
   createdBy: string,
}