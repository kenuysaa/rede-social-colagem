import React, { useState } from 'react';
import './createPost.css'; // Arquivo de estilo específico

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviar os dados para o back-end para criar o post
    const newPost = { title, content };
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => console.log(data)); // Pode adicionar lógica de sucesso
  };

  return (
    <div className="create-post-container">
      <h2>Criar Postagem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
          />
        </div>
        <div>
          <label htmlFor="content">Conteúdo</label>
          <textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required
          ></textarea>
        </div>
        <button type="submit">Criar</button>
      </form>
    </div>
  );
};

export default CreatePost;
