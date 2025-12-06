import React, { useState } from 'react';
import CollageGrid from '../components/CollageGrid';
import { uploadMultipleImages, createPost } from '../services/postService';

const CreatePostScreen = ({ onPostCreated }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleImageSelect = (file, index) => {
        // Se for adição nova (no fim do array) ou substituição
        const newFiles = [...selectedFiles];
        const newUrls = [...previewUrls];

        if (index >= newFiles.length) {
            newFiles.push(file);
            newUrls.push(URL.createObjectURL(file));
        } else {
            newFiles[index] = file;
            newUrls[index] = URL.createObjectURL(file);
        }

        setSelectedFiles(newFiles);
        setPreviewUrls(newUrls);
    };

    const handlePost = async () => {
        if (selectedFiles.length === 0) return alert("Selecione pelo menos uma imagem!");
        setUploading(true);
        try {
            const uploadedUrls = await uploadMultipleImages(selectedFiles);
            await createPost(uploadedUrls);
            onPostCreated(); // Volta para o feed
        } catch (error) {
            console.error(error);
            alert("Erro ao postar: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-4">
            <h2 className="text-xl font-bold mb-4">Nova Colagem</h2>

            <p className="text-sm text-zinc-400 mb-2">
                Toque nos espaços para adicionar fotos ({selectedFiles.length}/6)
            </p>

            {/* Grid Editável */}
            <div className="mb-6">
                <CollageGrid
                    images={previewUrls}
                    layout={previewUrls.length < 6 ? previewUrls.length + 1 : 6}
                    onImageSelect={handleImageSelect}
                    editable={true}
                />
            </div>

            <button
                onClick={handlePost}
                disabled={uploading || selectedFiles.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? "Publicando..." : "Compartilhar"}
            </button>

            {/* Botão limpar */}
            {selectedFiles.length > 0 && (
                <button
                    onClick={() => { setSelectedFiles([]); setPreviewUrls([]); }}
                    className="mt-4 text-red-400 text-sm"
                >
                    Limpar tudo
                </button>
            )}
        </div>
    );
};

export default CreatePostScreen;