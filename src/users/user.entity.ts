import { hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(
		private readonly _username: string,
		private readonly _email: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get password(): string {
		return this._password;
	}
	get username(): string {
		return this._username;
	}
	get email(): string {
		return this._email;
	}

	async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}
}
