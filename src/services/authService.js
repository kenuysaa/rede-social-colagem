import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebaseService';
import { validateUsername, UserData } from '../models/dataModels';

// --- SERVIÇOS DE AUTENTICAÇÃO ---

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Erro no login com Google:", error);
        throw error;
    }
};

export const setupAuthObserver = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
    }
};

// --- SERVIÇOS DE PERFIL (RF1, RNF1, RNF6) ---

export const getCurrentUserData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() };
    }
    return null;
};

export const isUsernameTaken = async (username) => {
    const q = query(collection(db, "users"),
        where("username", "==", username.toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    let isTaken = false;
    querySnapshot.forEach(doc => {
        if (doc.id !== auth.currentUser?.uid) {
            isTaken = true;
        }
    });
    return isTaken;
};

export const uploadProfilePicture = async (file) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado para upload.");

    const uid = auth.currentUser.uid;
    const storageRef = ref(storage, `users/${uid}/profile.jpg`);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const saveUserProfile = async (username, name, bio, profileImageUrl) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado para salvar perfil.");
    if (!validateUsername(username)) throw new Error("Nome de usuário inválido. Máx 12 caracteres.");

    const uid = auth.currentUser.uid;
    const userData = {
        username: username.toLowerCase(),
        name,
        bio,
        profileImageUrl,
        createdAt: new Date()
    };

    return setDoc(doc(db, "users", uid), userData, { merge: true });
};