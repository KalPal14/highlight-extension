import { LoginDto } from '~libs/dto/iam';
import { IBaseUserRo, ILoginRo } from '~libs/ro/iam';
import { USERS_URLS } from '~libs/routes/iam';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';
import { api } from '~/highlight-extension-fe/shared/api';

interface IUserHookReturn {
	data: { currentUser: IBaseUserRo | null };
	actions: {
		login(loginDto: LoginDto): Promise<void>;
	};
}

export function useUsers(): IUserHookReturn {
	const [, setJwt] = useCrossBrowserState('jwt');
	const [currentUser, setCurrentUser] = useCrossBrowserState('currentUser');

	async function login(loginDto: LoginDto): Promise<void> {
		const { jwt, ...userData } = await api.post<LoginDto, ILoginRo>(USERS_URLS.login, loginDto);

		setJwt(jwt);
		setCurrentUser(userData);
	}

	return {
		data: { currentUser },
		actions: { login },
	};
}
