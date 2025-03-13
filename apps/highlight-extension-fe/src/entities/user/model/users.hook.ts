import { LoginDto, RegistrationDto, UserExistenceCheckDto } from '~libs/dto/iam';
import { IBaseUserRo, ILoginRo, IRegistrationRo, TUserExictanceCheckRo } from '~libs/ro/iam';
import { USERS_URLS } from '~libs/routes/iam';
import { Exception } from '~libs/common';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';
import { api } from '~/highlight-extension-fe/shared/api';

import { useWorkspaces } from '../../workspace';

interface IUserHookReturn {
	data: { currentUser: IBaseUserRo | null };
	actions: {
		registration(registrationDto: RegistrationDto): Promise<void>;
		login(loginDto: LoginDto): Promise<void>;
		checkUserExistence: (dto: UserExistenceCheckDto) => Promise<TUserExictanceCheckRo>;
	};
}

export function useUsers(): IUserHookReturn {
	const [, setJwt] = useCrossBrowserState('jwt');
	const [, setCurrentWorkspace] = useCrossBrowserState('currentWorkspace');
	const [currentUser, setCurrentUser] = useCrossBrowserState('currentUser');

	const { getWorkspaces, createWorkspace } = useWorkspaces().actions;

	async function registration(registrationDto: RegistrationDto): Promise<void> {
		const { jwt, user } = await api.post<RegistrationDto, IRegistrationRo>(
			USERS_URLS.register,
			registrationDto
		);

		await createWorkspace({ name: `${user.username}'s workspace`, colors: [] }, jwt).catch(() => {
			throw new Exception(
				'Your account was created successfully, but there was an error setting up your workspace. Please log in to try creating the workspace again.'
			);
		});

		setJwt(jwt);
		setCurrentUser(user);
	}

	async function login(loginDto: LoginDto): Promise<void> {
		const { jwt, ...userData } = await api.post<LoginDto, ILoginRo>(USERS_URLS.login, loginDto);

		await getWorkspaces(jwt)
			.then((workspaces) => {
				setCurrentWorkspace(workspaces[0]);
				return workspaces;
			})
			.catch(() => [])
			.then(async (workspaces) => {
				if (!workspaces.length) {
					return createWorkspace(
						{ name: `${userData.username}'s workspace`, colors: [] },
						jwt
					).catch(() => {
						throw new Exception('Something went wrong. Reload the page or try again later');
					});
				}
				return workspaces;
			});

		setJwt(jwt);
		setCurrentUser(userData);
	}

	function checkUserExistence(dto: UserExistenceCheckDto): Promise<TUserExictanceCheckRo> {
		return api.get<UserExistenceCheckDto, TUserExictanceCheckRo>(USERS_URLS.exictanceCheck, dto);
	}

	return {
		data: { currentUser },
		actions: { registration, login, checkUserExistence },
	};
}
