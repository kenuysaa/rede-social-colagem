import { describe, it, expect } from 'vitest';
import { getCurrentUserData } from '../src/services/authService';
import { getDoc } from 'firebase/firestore';

describe('ProfileService', () => {

    it('retorna dados do usuário autenticado', async () => {
        getDoc.mockResolvedValue({
            exists: () => true,
            id: 'abc123',
            data: () => ({
                username: 'user123',
                name: 'User',
                bio: 'Bio'
            })
        });

        const user = await getCurrentUserData();

        expect(user.username).toBe('user123');
    });
});
