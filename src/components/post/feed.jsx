import React, { useEffect, useState } from 'react';
import './feed.css'; // Arquivo de estilo específico

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Aqui você pode chamar o back-end para obter os posts
    // Exemplo fictício de requisição para o back-end
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="feed-container">
      <h2>Feed de Postagens</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>Sem postagens por agora...</p>
      )}
    </div>
  );
};

export default Feed;
