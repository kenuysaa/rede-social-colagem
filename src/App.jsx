import React, { useState, useEffect } from 'react';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseService';
import { signInWithGoogle, getCurrentUserData } from './services/authService';

export default function App() {
  const [user, setUser] = useState(null); // Auth User
  const [userData, setUserData] = useState(null); // Firestore User Data
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('feed');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Se logou, checa se tem perfil no Firestore
        await fetchUserProfile(currentUser.uid);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const data = await getCurrentUserData();
      setUserData(data); // Se null, significa que precisa criar perfil
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // O useEffect vai disparar e checar o perfil
    } catch (e) {
      alert("Erro no login");
    }
  };

  // --- TELA DE CARREGAMENTO ---
  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
  }

  // --- FLUXO 1: LOGIN (Se não autenticado) ---
  if (!user) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tighter">SocialCollage</h1>
        <p className="text-zinc-500 mb-8">Compartilhe seus momentos em grades.</p>
        <button
          onClick={handleLogin}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
          Entrar com Google
        </button>
      </div>
    );
  }

  // --- FLUXO 2: CADASTRO/ONBOARDING (Se autenticado mas sem perfil) ---
  if (!userData) {
    return (
      <EditProfileScreen
        isNewUser={true}
        onSaveComplete={() => fetchUserProfile(user.uid)}
      />
    );
  }

  // --- FLUXO 3: APP PRINCIPAL (Se autenticado E com perfil) ---
  return (
    <div className="bg-black min-h-screen text-white font-sans antialiased flex justify-center">
      <div className="w-full max-w-md bg-black min-h-screen relative shadow-2xl shadow-zinc-900">

        {/* Renderização Condicional das Telas */}
        <div className="pb-20"> {/* Padding bottom para a barra de navegação */}
          {currentScreen === 'feed' && <FeedScreen />}

          {currentScreen === 'create' && (
            <CreatePostScreen onPostCreated={() => setCurrentScreen('feed')} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen onEditProfile={() => setCurrentScreen('edit_profile')} />
          )}

          {currentScreen === 'edit_profile' && (
            <EditProfileScreen
              isNewUser={false}
              onSaveComplete={() => setCurrentScreen('profile')}
            />
          )}
        </div>

        {/* Tab Bar de Navegação Mobile */}
        {currentScreen !== 'edit_profile' && (
          <nav className="fixed bottom-0 w-full max-w-md bg-black border-t border-zinc-900 flex justify-around p-4 pb-6 z-50">
            <button
              onClick={() => setCurrentScreen('feed')}
              className={`flex flex-col items-center transition ${currentScreen === 'feed' ? 'text-white scale-110' : 'text-zinc-600'}`}
            >
              <span className="text-2xl">🏠</span>
            </button>

            <button
              onClick={() => setCurrentScreen('create')}
              className="bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center -mt-8 border-4 border-black shadow-lg shadow-zinc-800 transition hover:scale-105"
            >
              <span className="text-3xl font-light mb-1">+</span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center transition ${currentScreen === 'profile' ? 'text-white scale-110' : 'text-zinc-600'}`}
            >
              {/* Mostra a foto do user na tab bar */}
              <div className={`w-7 h-7 rounded-full overflow-hidden border-2 ${currentScreen === 'profile' ? 'border-white' : 'border-transparent'}`}>
                <img src={userData.profileImageUrl || "https://via.placeholder.com/50"} alt="" className="w-full h-full object-cover" />
              </div>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}