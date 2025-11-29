// tests/setup/firebaseMock.js
import { vi } from 'vitest';

// BATCH FIXO COMPARTILHADO ENTRE TESTE E SERVIÇO
const batchMock = {
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn()
};

// --- Mock firebaseService.js ---
vi.mock('../../src/services/firebaseService', () => ({
    auth: {
        currentUser: { uid: 'test_user_id' }
    },
    db: {},
    storage: {}
}));

// --- Mock firebase/auth ---
vi.mock('firebase/auth', () => ({
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn()
}));

// --- Mock firebase/firestore ---
vi.mock('firebase/firestore', () => ({
    doc: vi.fn(() => ({ id: 'mocked_id' })),
    collection: vi.fn(() => ({ path: 'posts' })),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    onSnapshot: vi.fn(),
    writeBatch: vi.fn(() => batchMock),
    increment: vi.fn(() => 'inc')
}));

// --- Mock firebase/storage ---
vi.mock('firebase/storage', () => ({
    ref: vi.fn(() => ({ fullPath: 'path/file.jpg' })),
    uploadBytes: vi.fn(() => Promise.resolve({ ref: { fullPath: 'path/file.jpg' } })),
    getDownloadURL: vi.fn(() => Promise.resolve('http://mocked.url/image.jpg'))
}));
