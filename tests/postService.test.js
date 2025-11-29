import { describe, it, expect } from 'vitest';
import {
    uploadMultipleImages,
    createPost,
    toggleLike
} from '../src/services/postService';

import {
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';

import {
    setDoc,
    writeBatch
} from 'firebase/firestore';

describe('PostService', () => {

    it('falha ao enviar mais de 6 imagens', async () => {
        await expect(uploadMultipleImages(new Array(7)))
            .rejects
            .toThrow();
    });

    it('faz upload e retorna URLs', async () => {
        const file = new File([], "foto.jpg");

        const urls = await uploadMultipleImages([file]);

        expect(uploadBytes).toHaveBeenCalled();
        expect(getDownloadURL).toHaveBeenCalled();
        expect(urls[0]).toBe('http://mocked.url/image.jpg');
    });

    it('cria post no Firestore', async () => {
        setDoc.mockResolvedValue();

        await createPost(['url1']);
        expect(setDoc).toHaveBeenCalledOnce();
    });

    it('toggleLike adiciona like quando não curtido', async () => {
        const batch = writeBatch();
        batch.commit.mockResolvedValue();

        await toggleLike('post1', false);

        expect(batch.set).toHaveBeenCalled();
        expect(batch.update).toHaveBeenCalled();
        expect(batch.commit).toHaveBeenCalled();
    });
});
