import React, { useEffect, useState } from 'react';
import { signOut, getCurrentUserData, deleteUserAccount } from '../services/authService';
import { getUserPosts, deletePost } from '../services/postService';

const ProfileScreen = ({ onEditProfile }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const userData = await getCurrentUserData();
            if (userData) {
                setUser(userData);
                const userPosts = await getUserPosts(userData.uid);
                setPosts(userPosts);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("Tem certeza que deseja apagar este post?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(p => p.postId !== postId));
            } catch (error) {
                alert("Erro ao deletar post");
            }
        }
    };

    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm("ATENÇÃO: Isso excluirá sua conta permanentemente.");
        if (confirm1) {
            const confirm2 = window.confirm("Tem certeza absoluta? Essa ação não pode ser desfeita.");
            if (confirm2) {
                try {
                    await deleteUserAccount();
                } catch (error) {
                    alert("Por segurança, faça login novamente antes de excluir a conta.");
                }
            }
        }
    };

    if (loading) return <div className="text-white p-10 text-center">Carregando...</div>;
    if (!user) return null; // Tratado pelo App.jsx

    return (
        <div className="flex flex-col w-full pb-24 text-white">

            {/* Header */}
            <div className="flex justify-between p-6">
                <div className="w-20 h-20 rounded-full border-2 border-purple-500 overflow-hidden">
                    <img src={user.profileImageUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={onEditProfile} className="px-4 py-1 border border-zinc-600 rounded text-sm hover:bg-zinc-800">
                        Editar Perfil
                    </button>
                    <button onClick={() => signOut()} className="px-4 py-1 bg-zinc-800 rounded text-sm text-red-300">
                        Sair
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="px-6 mb-6">
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-zinc-400 text-sm">@{user.username}</p>
                <p className="mt-2 text-sm">{user.bio}</p>
            </div>

            <div className="border-t border-zinc-800 my-2"></div>

            {/* Posts Grid com Opção de Deletar */}
            <div className="px-1 grid grid-cols-3 gap-1">
                {posts.map(post => (
                    <div key={post.postId} className="relative aspect-square group">
                        <img src={post.imageUrls[0]} className="w-full h-full object-cover" />

                        {/* Botão de Delete (Aparece no hover ou sempre visível no mobile se preferir) */}
                        <button
                            onClick={() => handleDeletePost(post.postId)}
                            className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-10 px-6">
                <button onClick={handleDeleteAccount} className="text-red-600 text-xs w-full text-center hover:underline">
                    Excluir minha conta
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;