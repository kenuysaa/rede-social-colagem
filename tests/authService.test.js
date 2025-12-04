import { describe, it, expect } from 'vitest';
import {
    signInWithGoogle,
    isUsernameTaken,
    saveUserProfile
} from '../src/services/authService';

import { signInWithPopup } from 'firebase/auth';
import { getDocs, setDoc } from 'firebase/firestore';

describe('AuthService', () => {

    it('login com Google chama signInWithPopup', async () => {
        signInWithPopup.mockResolvedValue({ user: { uid: '1234' } });

        const user = await signInWithGoogle();
        expect(signInWithPopup).toHaveBeenCalledOnce();
        expect(user.uid).toBe('1234');
    });

    it('detecta username já existente', async () => {
        getDocs.mockResolvedValue({
            forEach: fn => fn({ id: 'outro_usuario' })
        });

        const exists = await isUsernameTaken('teste');
        expect(exists).toBe(true);
    });

    it('salva perfil corretamente', async () => {
        setDoc.mockResolvedValue();

        await saveUserProfile('meuuser', 'Nome', 'Bio', 'url_img');

        expect(setDoc).toHaveBeenCalledOnce();
    });
});
