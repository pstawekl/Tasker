import { User } from '@/lib/models/users';
export class UserUtils {
    public userInfo: User;

    constructor(userInfo: User) {
        this.userInfo = userInfo;
    }

    public static getInstance() {
        return new UserUtils({
            id: '',
            email: '',
            username: '',
            created_at: '',
            picture: '',
        });
    }

    public getUser() {
        return this.userInfo;
    }

    public setUser(userInfo: User) {
        this.userInfo = userInfo;
    }
}
