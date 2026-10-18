import { useLocalStorage } from '@siberiacancode/reactuse';

import type { User } from '@/generated/api';

const PREFIX = 'jbp-projects';

export const AUTH_TOKEN = `${PREFIX}-token`;

export const useAuthTokenLocalStorage = () => useLocalStorage<string>(AUTH_TOKEN);
export const useUserLocalStorage = () => useLocalStorage<User>(`${PREFIX}-user`);
