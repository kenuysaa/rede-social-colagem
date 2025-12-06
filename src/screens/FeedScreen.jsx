import React, { useEffect, useState } from 'react';
import { getFeedPosts } from '../services/postService';
import PostCard from '../components/PostCard';

export default function FeedScreen() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getFeedPosts((updatedPosts) => {
            setPosts(updatedPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
                Carregando feed...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            <header className="p-4 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-10">
                <h1 className="text-xl font-bold text-white tracking-tight">SocialCollage</h1>
            </header>

            <main className="max-w-md mx-auto">
                {posts.length === 0 ? (
                    <div className="text-center p-10 text-zinc-500">
                        Nenhum post ainda. Seja o primeiro!
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.postId} post={post} />
                    ))
                )}
            </main>
        </div>
    );
}
