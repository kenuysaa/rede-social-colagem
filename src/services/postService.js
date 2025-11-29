import { doc, setDoc, collection, onSnapshot, increment, writeBatch, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebaseService';
import { PostData } from '../models/dataModels';

// --- SERVIÇOS DE POSTAGENS (RF2, RNF2, RNF3) ---

/**
 * Faz upload de múltiplos arquivos para o Storage (RNF2, RNF3).
 * @param {File[]} files 
 * @returns {Promise<string[]>} Lista de URLs das imagens
 */
export const uploadMultipleImages = async (files) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado para upload.");
    if (files.length === 0 || files.length > 6) throw new Error("A colagem deve ter entre 1 e 6 imagens.");

    const uploadPromises = [];
    const postId = doc(collection(db, "posts")).id;

    files.forEach((file, index) => {
        const storageRef = ref(storage, `posts/${postId}/${index}.jpg`);
        const uploadTask = uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
        uploadPromises.push(uploadTask);
    });

    return Promise.all(uploadPromises);
};

/**
 * Cria o documento de postagem no Firestore (RF2).
 * @param {string[]} imageUrls 
 * @returns {Promise<void>}
 */
export const createPost = async (imageUrls) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado para postar.");

    const newPostRef = doc(collection(db, "posts"));
    const postData = {
        userId: auth.currentUser.uid,
        imageUrls: imageUrls,
        likeCount: 0,
        timestamp: new Date()
    };

    return setDoc(newPostRef, postData);
};

/**
 * Obtém posts em tempo real para o feed (onSnapshot).
 * @param {(posts: PostData[]) => void} callback
 * @returns {() => void} Função para cancelar a assinatura
 */
export const getFeedPosts = (callback) => {
    const postsCollection = collection(db, "posts");

    return onSnapshot(postsCollection, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            postId: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }));
        // Ordenação manual: do mais novo para o mais antigo (Decrescente)
        posts.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
        callback(posts);
    }, (error) => {
        console.error("Erro ao carregar o feed em tempo real:", error);
    });
};


// --- SERVIÇOS DE INTERAÇÃO (RNF5) ---

/**
 * Verifica se o usuário atual curtiu um post.
 * @param {string} postId 
 * @returns {Promise<boolean>}
 */
export const hasLiked = async (postId) => {
    if (!auth.currentUser) return false;
    const likeRef = doc(db, "posts", postId, "likes", auth.currentUser.uid);
    const likeSnap = await getDoc(likeRef);
    return likeSnap.exists();
};

/**
 * Curte/Descurte uma postagem (RNF5) usando operações atômicas.
 * @param {string} postId 
 * @param {boolean} isCurrentlyLiked 
 * @returns {Promise<void>}
 */
export const toggleLike = async (postId, isCurrentlyLiked) => {
    if (!auth.currentUser) throw new Error("Usuário precisa estar autenticado para curtir.");

    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);

    const postRef = doc(db, "posts", postId);
    const likeRef = doc(db, "posts", postId, "likes", uid);

    if (isCurrentlyLiked) {
        // Descurtir: Remove o documento de like e decrementa o contador
        batch.delete(likeRef);
        batch.update(postRef, { likeCount: increment(-1) });
    } else {
        // Curtir: Adiciona o documento de like e incrementa o contador
        batch.set(likeRef, { userId: uid, timestamp: new Date() });
        batch.update(postRef, { likeCount: increment(1) });
    }

    await batch.commit();
};