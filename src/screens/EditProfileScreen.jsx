import React, { useState, useEffect } from 'react';
import { saveUserProfile, uploadProfilePicture, isUsernameTaken, getCurrentUserData } from '../services/authService';
import { auth } from '../services/firebaseService';

const EditProfileScreen = ({ onSaveComplete, isNewUser }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isNewUser) {
            loadCurrentData();
        } else {
            setName(auth.currentUser?.displayName || '');
            setPreviewUrl(auth.currentUser?.photoURL || null);
        }
    }, [isNewUser]);

    const loadCurrentData = async () => {
        const data = await getCurrentUserData();
        if (data) {
            setUsername(data.username);
            setName(data.name);
            setBio(data.bio || '');
            setPreviewUrl(data.profileImageUrl);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validação de Username único
            const taken = await isUsernameTaken(username);
            // Se for o próprio usuário mantendo o nome, não conta como tomado
            const currentUserData = await getCurrentUserData();
            if (taken && currentUserData?.username !== username) {
                alert("Este nome de usuário já está em uso.");
                setLoading(false);
                return;
            }

            let finalImageUrl = previewUrl;

            // Upload da imagem se houver nova
            if (imageFile) {
                finalImageUrl = await uploadProfilePicture(imageFile);
            }

            await saveUserProfile(username, name, bio, finalImageUrl);
            onSaveComplete(); // Retorna para o fluxo principal
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">
                {isNewUser ? "Criar Perfil" : "Editar Perfil"}
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">

                {/* Upload de Imagem */}
                <div className="flex justify-center mb-4">
                    <label className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-zinc-600 cursor-pointer hover:border-purple-500 transition">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-xs text-center p-1">
                                Adicionar Foto
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>

                <div>
                    <label className="text-xs text-zinc-400 ml-1">Nome de Usuário (max 12 chars)</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        maxLength={12}
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-600"
                        placeholder="usuario_top"
                    />
                </div>

                <div>
                    <label className="text-xs text-zinc-400 ml-1">Nome de Exibição</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-600"
                        placeholder="Seu Nome"
                    />
                </div>

                <div>
                    <label className="text-xs text-zinc-400 ml-1">Biografia</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-600 resize-none h-24"
                        placeholder="Conte algo sobre você..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Salvando..." : "Salvar Perfil"}
                </button>

                {!isNewUser && (
                    <button
                        type="button"
                        onClick={onSaveComplete}
                        className="text-zinc-500 text-sm hover:text-white"
                    >
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
};

export default EditProfileScreen;