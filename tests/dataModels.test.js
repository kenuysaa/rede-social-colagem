import { describe, it, expect } from 'vitest';
import { validateUsername } from '../src/models/dataModels';

describe('validateUsername', () => {

    it('aceita username válido', () => {
        expect(validateUsername('user_123')).toBe(true);
    });

    it('rejeita username > 12 caracteres', () => {
        expect(validateUsername('abcdefghijklm')).toBe(false); // 13 chars
    });

    it('rejeita caracteres inválidos', () => {
        expect(validateUsername('user!@')).toBe(false);
    });

    it('rejeita vazio', () => {
        expect(validateUsername('')).toBe(false);
    });
});
