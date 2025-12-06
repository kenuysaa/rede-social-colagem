import React, { useState, useEffect } from 'react';
import CollageGrid from './CollageGrid';
import { toggleLike, hasLiked } from '../services/postService';
import { auth } from '../services/firebaseService';

export default function PostCard({ post }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likeCount || 0);
    const [animateLike, setAnimateLike] = useState(false);

    // Determina o layout visual baseado na quantidade de imagens salvas
    const layoutCount = post.imageUrls ? post.imageUrls.length : 0;

    useEffect(() => {
        const checkLikeStatus = async () => {
            const userHasLiked = await hasLiked(post.postId);
            setLiked(userHasLiked);
        };
        checkLikeStatus();
    }, [post.postId]);

    const handleLike = async () => {
        if (!auth.currentUser) return alert("Faça login para curtir");

        // Otimistic UI Update (atualiza visualmente antes do servidor)
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
        setAnimateLike(true);
        setTimeout(() => setAnimateLike(false), 300);

        try {
            await toggleLike(post.postId, liked);
        } catch (error) {
            console.error("Erro ao curtir:", error);
            // Reverte em caso de erro
            setLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    return (
        <div className="bg-zinc-900 mb-6 pb-4 border-b border-zinc-800">
            {/* Cabeçalho do Post (simples) */}
            <div className="flex items-center p-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {/* Fallback para avatar */}
                    U
                </div>
                <span className="text-zinc-200 font-semibold text-sm">Usuário</span>
            </div>

            {/* Grid de Imagens */}
            <div className="px-1">
                <CollageGrid
                    images={post.imageUrls}
                    layout={layoutCount}
                    editable={false}
                />
            </div>

            {/* Ações (Like) */}
            <div className="p-3 flex items-center gap-2">
                <button
                    onClick={handleLike}
                    className={`transition-transform duration-200 ${animateLike ? 'scale-125' : 'scale-100'}`}
                >
                    {liked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-red-500">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    )}
                </button>
                <span className="text-zinc-300 font-medium text-sm">
                    {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
                </span>
            </div>
        </div>
    );
}
