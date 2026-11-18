import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { User } from 'firebase/auth';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  FolderOpen,
  Heart,
  LogOut,
  RefreshCw,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import {
  deleteMuroPost,
  ensureMuroFolder,
  getAccessToken,
  googleSignIn,
  initAuth,
  listMuroPosts,
  logout,
  MuroDriveFolder,
  MuroDrivePost,
  publishMuroPost,
  updateMuroPostLikes,
} from '../services/googleDriveMuro';

const RETOS_LIST = [
  ['Nivel 1 · Explorador', 'Pídele a una IA que resuma tu mapa mental en 5 líneas.'],
  ['Nivel 1 · Explorador', 'Pídele 3 preguntas de repaso sobre tu tema.'],
  ['Nivel 2 · Creador', 'Convierte tu mapa en un cuestionario de 5 preguntas con retroalimentación.'],
  ['Nivel 2 · Creador', 'Pide una analogía que explique tu tema a un niño de 10 años.'],
  ['Nivel 3 · Crítico', 'Pide datos sobre tu tema y verifícalos con 2 fuentes.'],
  ['Nivel 3 · Crítico', 'Mejora un prompt vago agregando rol, contexto y formato.'],
  ['Reto final', 'Crea un código QR que lleve a tu mejor resultado y compártelo.'],
] as const;

type PendingMutation =
  | { type: 'like'; post: MuroDrivePost }
  | { type: 'delete'; post: MuroDrivePost };

function GoogleSignInButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-3 rounded-full bg-white hover:bg-[#F8F9FA] active:bg-[#EEEEEE] text-[#1F1F1F] border border-[#747775] px-5 py-2.5 text-sm font-medium shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F57923]"
    >
      <span className="w-5 h-5 shrink-0 block" aria-hidden="true">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </span>
      <span>{disabled ? 'Conectando...' : 'Sign in with Google'}</span>
    </button>
  );
}

export function MuroQrActivity({
  initialTab = 'mapas',
  isStandalonePage = false,
  onBack,
}: {
  initialTab?: 'mapas' | 'retos';
  isStandalonePage?: boolean;
  onBack?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'mapas' | 'retos'>(initialTab);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [folder, setFolder] = useState<MuroDriveFolder | null>(null);
  const [posts, setPosts] = useState<MuroDrivePost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [qrMapasUrl, setQrMapasUrl] = useState<string>('');
  const [qrRetosUrl, setQrRetosUrl] = useState<string>('');

  // Form states — Mapas mentales
  const [mapaNombre, setMapaNombre] = useState('');
  const [mapaTitulo, setMapaTitulo] = useState('');
  const [mapaEnlace, setMapaEnlace] = useState('');
  const [mapaTexto, setMapaTexto] = useState('');

  // Form states — Retos de IA
  const [retoIndex, setRetoIndex] = useState(0);
  const [retoNombre, setRetoNombre] = useState('');
  const [retoHerramienta, setRetoHerramienta] = useState('');
  const [retoPrompt, setRetoPrompt] = useState('');
  const [retoResultado, setRetoResultado] = useState('');

  // Confirmation modal for mutating / destructive Drive actions
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const baseOrigin = window.location.origin;
    const mapasShareUrl = `${baseOrigin}/?vista=muro-qr#mapas`;
    const retosShareUrl = `${baseOrigin}/?vista=muro-qr#retos`;

    QRCode.toDataURL(mapasShareUrl, { width: 160, margin: 1 })
      .then(setQrMapasUrl)
      .catch(() => setQrMapasUrl(''));
    QRCode.toDataURL(retosShareUrl, { width: 160, margin: 1 })
      .then(setQrRetosUrl)
      .catch(() => setQrRetosUrl(''));
  }, []);

  const syncWithDrive = useCallback(async (token: string) => {
    setIsLoadingPosts(true);
    setErrorMessage('');
    try {
      const muroFolder = await ensureMuroFolder(token);
      setFolder(muroFolder);
      const drivePosts = await listMuroPosts(token, muroFolder.id);
      setPosts(drivePosts);
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setErrorMessage('Tu sesión de Google Drive expiró. Inicia sesión nuevamente para continuar.');
      } else {
        setErrorMessage('No se pudo cargar la carpeta "muro" desde Google Drive.');
      }
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setNeedsAuth(false);
        syncWithDrive(token);
      },
      (authUser) => {
        setUser(authUser);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [syncWithDrive]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
      await syncWithDrive(result.accessToken);
    } catch {
      setErrorMessage('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setFolder(null);
    setPosts([]);
    setNeedsAuth(true);
    setStatusMessage('');
  };

  const handleTabChange = (tab: 'mapas' | 'retos') => {
    setActiveTab(tab);
    if (isStandalonePage) {
      try {
        window.history.replaceState(null, '', `/?vista=muro-qr#${tab}`);
      } catch {
        // ignore history error
      }
    }
  };

  const handlePublishMapa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!mapaTitulo.trim()) {
      setErrorMessage('Escribe el título del mapa mental antes de publicar.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setErrorMessage('Conecta tu cuenta de Google Drive para guardar tu respuesta en la carpeta "muro".');
      return;
    }

    setIsPublishing(true);
    try {
      const activeFolder = folder ?? (await ensureMuroFolder(token));
      if (!folder) setFolder(activeFolder);

      const created = await publishMuroPost(token, activeFolder.id, {
        tipo: 'mapas',
        autor: mapaNombre.trim() || user?.displayName || 'Anónimo',
        titulo: mapaTitulo.trim(),
        enlace: mapaEnlace.trim(),
        texto: mapaTexto.trim(),
        likes: 0,
        creadoEn: new Date().toISOString(),
      });

      setPosts((prev) => [created, ...prev]);
      setMapaTitulo('');
      setMapaEnlace('');
      setMapaTexto('');
      setStatusMessage('¡Publicado! Tu respuesta quedó guardada en la carpeta "muro" de Google Drive.');
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setErrorMessage('Tu sesión expiró. Vuelve a iniciar sesión con Google para publicar.');
      } else {
        setErrorMessage('No se pudo guardar el archivo en Google Drive.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishReto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!retoResultado.trim()) {
      setErrorMessage('Describe tu resultado y reflexión antes de publicar.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setErrorMessage('Conecta tu cuenta de Google Drive para guardar tu respuesta en la carpeta "muro".');
      return;
    }

    setIsPublishing(true);
    try {
      const activeFolder = folder ?? (await ensureMuroFolder(token));
      if (!folder) setFolder(activeFolder);

      const selectedReto = RETOS_LIST[retoIndex];
      const created = await publishMuroPost(token, activeFolder.id, {
        tipo: 'retos',
        autor: retoNombre.trim() || user?.displayName || 'Anónimo',
        retoIndex,
        retoNivel: selectedReto[0],
        retoConsigna: selectedReto[1],
        herramienta: retoHerramienta.trim(),
        prompt: retoPrompt.trim(),
        resultado: retoResultado.trim(),
        likes: 0,
        creadoEn: new Date().toISOString(),
      });

      setPosts((prev) => [created, ...prev]);
      setRetoHerramienta('');
      setRetoPrompt('');
      setRetoResultado('');
      setStatusMessage('¡Publicado! Tu reto quedó guardado en la carpeta "muro" de Google Drive.');
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setErrorMessage('Tu sesión expiró. Vuelve a iniciar sesión con Google para publicar.');
      } else {
        setErrorMessage('No se pudo guardar el archivo en Google Drive.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfirmMutation = async () => {
    if (!pendingMutation) return;
    const token = await getAccessToken();
    if (!token) {
      setPendingMutation(null);
      setNeedsAuth(true);
      setErrorMessage('Inicia sesión con Google para actualizar archivos en Drive.');
      return;
    }

    setIsMutating(true);
    setErrorMessage('');
    try {
      if (pendingMutation.type === 'like') {
        const updated = await updateMuroPostLikes(token, pendingMutation.post);
        setPosts((prev) =>
          prev.map((item) => (item.driveFileId === updated.driveFileId ? updated : item))
        );
        setStatusMessage('Reacción actualizada en Google Drive.');
      } else if (pendingMutation.type === 'delete') {
        await deleteMuroPost(token, pendingMutation.post.driveFileId);
        setPosts((prev) =>
          prev.filter((item) => item.driveFileId !== pendingMutation.post.driveFileId)
        );
        setStatusMessage('Publicación eliminada de la carpeta "muro" en Google Drive.');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setErrorMessage('Tu sesión expiró. Vuelve a iniciar sesión con Google.');
      } else {
        setErrorMessage('No se pudo completar la operación en Google Drive.');
      }
    } finally {
      setIsMutating(false);
      setPendingMutation(null);
    }
  };

  const filteredPosts = posts.filter((p) => p.tipo === activeTab);
  const currentQrDataUrl = activeTab === 'mapas' ? qrMapasUrl : qrRetosUrl;

  return (
    <div className={isStandalonePage ? 'min-h-screen bg-[#FAF7F0] text-[#3E3028] py-8 px-4 sm:px-6' : ''}>
      <div className={isStandalonePage ? 'max-w-5xl mx-auto space-y-5' : 'space-y-5'}>
        {/* Header */}
        <div className="rounded-3xl bg-[#FFF0DE] border border-[#F7C99D] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              {isStandalonePage && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F57923] hover:text-[#DF6613] mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al portafolio Savia Docente
                </button>
              )}
              <p className="text-xs font-semibold text-[#F57923]">
                Actividad 2 · Almacenamiento en Google Drive (carpeta: muro)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E3028]">
                Muro QR de la clase
              </h2>
            </div>

            {!needsAuth && user ? (
              <div className="flex flex-wrap items-center gap-2">
                {folder && (
                  <a
                    href={folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F7C99D]/55 border border-[#3E3028]/12 px-3.5 py-2 text-xs font-semibold text-[#3E3028] transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#F57923]" />
                    Carpeta: {folder.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    const token = await getAccessToken();
                    if (token) syncWithDrive(token);
                  }}
                  disabled={isLoadingPosts}
                  aria-label="Actualizar publicaciones desde Google Drive"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F7C99D]/55 border border-[#3E3028]/12 px-3.5 py-2 text-xs font-semibold text-[#3E3028] transition-colors cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#F57923] ${isLoadingPosts ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3E3028] hover:bg-[#3E3028]/90 text-[#FAF7F0] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir ({user.displayName?.split(' ')[0] || 'Google'})
                </button>
              </div>
            ) : (
              <GoogleSignInButton onClick={handleLogin} disabled={isLoggingIn} />
            )}
          </div>

          {needsAuth && (
            <div className="rounded-2xl bg-[#FAF7F0] border border-[#3E3028]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
                Conecta tu cuenta de Google para alojar y consultar automáticamente las respuestas dentro de la carpeta <strong className="text-[#3E3028]">muro</strong> de tu Google Drive.
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleTabChange('mapas')}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                activeTab === 'mapas'
                  ? 'bg-[#F57923] text-[#FAF7F0] border-[#F57923]'
                  : 'bg-[#FAF7F0] text-[#3E3028] border-[#3E3028]/12 hover:bg-[#F7C99D]/45'
              }`}
            >
              Mapas mentales
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('retos')}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                activeTab === 'retos'
                  ? 'bg-[#F57923] text-[#FAF7F0] border-[#F57923]'
                  : 'bg-[#FAF7F0] text-[#3E3028] border-[#3E3028]/12 hover:bg-[#F7C99D]/45'
              }`}
            >
              Retos de IA
            </button>
          </div>
        </div>

        {/* Status / Error Alerts */}
        {statusMessage && (
          <div
            role="status"
            className="rounded-2xl bg-[#FFF0DE] border border-[#F57923]/40 px-4 py-3 text-xs sm:text-sm font-medium text-[#3E3028] flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#F57923] shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl bg-[#F7C99D]/45 border border-[#9A3412]/30 px-4 py-3 text-xs sm:text-sm font-medium text-[#9A3412]"
          >
            {errorMessage}
          </div>
        )}

        {/* QR Banner */}
        <div className="rounded-3xl bg-white border border-[#3E3028]/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#3E3028]">
              {activeTab === 'mapas'
                ? 'Escanea y publica tu mapa mental'
                : 'Escanea, elige un reto y comparte tu resultado'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
              {activeTab === 'mapas'
                ? 'Pega el enlace de tu mapa (Mapify, Drive, Canva, imagen en línea…) y cuéntanos tu idea central. Al publicar, se guarda en tu carpeta "muro" de Google Drive.'
                : 'Indica la herramienta de IA, tu prompt y una reflexión de una línea. Al publicar, la respuesta se guarda en tu carpeta "muro" de Google Drive.'}
            </p>
          </div>
          {currentQrDataUrl && (
            <div className="w-28 h-28 rounded-2xl bg-[#FAF7F0] border border-[#3E3028]/10 p-2 shrink-0 self-start sm:self-center">
              <img
                src={currentQrDataUrl}
                alt={`Código QR para ${activeTab === 'mapas' ? 'Mapas mentales' : 'Retos de IA'}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Active Tab Form */}
        {activeTab === 'mapas' ? (
          <form
            onSubmit={handlePublishMapa}
            className="rounded-3xl bg-[#FFF0DE]/65 border border-[#F7C99D] p-5 sm:p-6 space-y-3"
          >
            <h4 className="font-serif text-lg font-bold text-[#3E3028]">
              Publicar mapa mental en carpeta &ldquo;muro&rdquo;
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={mapaNombre}
                onChange={(e) => setMapaNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
              />
              <input
                type="text"
                value={mapaTitulo}
                onChange={(e) => setMapaTitulo(e.target.value)}
                placeholder="Título del mapa mental *"
                className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
              />
            </div>
            <input
              type="url"
              value={mapaEnlace}
              onChange={(e) => setMapaEnlace(e.target.value)}
              placeholder="Enlace al mapa (https://…)"
              className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
            />
            <textarea
              rows={3}
              value={mapaTexto}
              onChange={(e) => setMapaTexto(e.target.value)}
              placeholder="Idea central y lo que más aprendiste"
              className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-[#6C584C]">
                Se guardará un archivo con esta respuesta dentro de la carpeta <strong className="text-[#3E3028]">muro</strong> en Drive.
              </span>
              <button
                type="submit"
                disabled={isPublishing}
                className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {isPublishing ? 'Guardando en Drive...' : 'Publicar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Challenge reference cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {RETOS_LIST.map(([nivel, consigna], idx) => (
                <button
                  key={consigna}
                  type="button"
                  onClick={() => setRetoIndex(idx)}
                  className={`text-left rounded-2xl p-3.5 border transition-colors cursor-pointer ${
                    retoIndex === idx
                      ? 'bg-[#FFF0DE] border-[#F57923]'
                      : 'bg-white border-[#3E3028]/10 hover:border-[#F57923]/45'
                  }`}
                >
                  <span className="inline-block text-[11px] font-bold text-[#F57923] mb-1">
                    {nivel}
                  </span>
                  <p className="text-xs sm:text-sm text-[#3E3028] leading-snug">{consigna}</p>
                </button>
              ))}
            </div>

            <form
              onSubmit={handlePublishReto}
              className="rounded-3xl bg-[#FFF0DE]/65 border border-[#F7C99D] p-5 sm:p-6 space-y-3"
            >
              <h4 className="font-serif text-lg font-bold text-[#3E3028]">
                Publicar resultado del reto en carpeta &ldquo;muro&rdquo;
              </h4>
              <select
                value={retoIndex}
                onChange={(e) => setRetoIndex(Number(e.target.value))}
                className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] focus:outline-none focus:border-[#F57923]"
              >
                {RETOS_LIST.map(([nivel, consigna], idx) => (
                  <option key={consigna} value={idx}>
                    {nivel} — {consigna}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={retoNombre}
                  onChange={(e) => setRetoNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
                />
                <input
                  type="text"
                  value={retoHerramienta}
                  onChange={(e) => setRetoHerramienta(e.target.value)}
                  placeholder="Herramienta de IA usada"
                  className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
                />
              </div>
              <textarea
                rows={2}
                value={retoPrompt}
                onChange={(e) => setRetoPrompt(e.target.value)}
                placeholder="Tu prompt"
                className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
              />
              <textarea
                rows={3}
                value={retoResultado}
                onChange={(e) => setRetoResultado(e.target.value)}
                placeholder="Resultado y reflexión: ¿qué te sorprendió? *"
                className="w-full rounded-xl bg-[#FAF7F0] border border-[#3E3028]/12 px-3.5 py-2.5 text-sm text-[#3E3028] placeholder:text-[#6C584C]/70 focus:outline-none focus:border-[#F57923]"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-[#6C584C]">
                  Se guardará en la carpeta <strong className="text-[#3E3028]">muro</strong> de Google Drive.
                </span>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {isPublishing ? 'Guardando en Drive...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feed of Drive posts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-serif text-lg font-bold text-[#3E3028]">
              Respuestas guardadas en Google Drive ({filteredPosts.length})
            </h4>
          </div>

          {isLoadingPosts ? (
            <div className="rounded-2xl bg-white border border-[#3E3028]/10 p-6 text-center text-sm text-[#6C584C]">
              Consultando respuestas de la carpeta &ldquo;muro&rdquo; en Google Drive...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#3E3028]/10 p-6 text-center text-sm text-[#6C584C]">
              {needsAuth
                ? 'Inicia sesión con Google para ver y publicar respuestas en tu carpeta "muro".'
                : 'Aún no hay publicaciones en esta pestaña dentro de tu carpeta "muro". ¡Sé la primera persona!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.driveFileId}
                  className="rounded-2xl bg-white border border-[#3E3028]/10 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-2">
                    {post.tipo === 'mapas' ? (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-serif text-base font-bold text-[#3E3028]">
                              {post.titulo}
                            </h5>
                            <p className="text-xs text-[#6C584C]">por {post.autor}</p>
                          </div>
                        </div>
                        {post.texto && (
                          <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
                            {post.texto}
                          </p>
                        )}
                        {post.enlace && /^https?:\/\//.test(post.enlace) && (
                          <a
                            href={post.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F57923] hover:text-[#DF6613] underline underline-offset-4"
                          >
                            Ver mapa mental
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        {post.retoNivel && (
                          <span className="inline-block rounded-full bg-[#FFF0DE] border border-[#F7C99D] px-2.5 py-0.5 text-[11px] font-bold text-[#F57923]">
                            {post.retoNivel}
                          </span>
                        )}
                        <p className="text-xs text-[#6C584C]">
                          por <strong className="text-[#3E3028]">{post.autor}</strong>
                          {post.herramienta ? ` · ${post.herramienta}` : ''}
                        </p>
                        {post.prompt && (
                          <p className="text-xs italic text-[#3E3028] bg-[#FAF7F0] rounded-xl p-2.5 border border-[#3E3028]/8">
                            {post.prompt}
                          </p>
                        )}
                        {post.resultado && (
                          <p className="text-xs sm:text-sm text-[#6C584C] leading-relaxed">
                            {post.resultado}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#3E3028]/8">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPendingMutation({ type: 'like', post })}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 border border-[#3E3028]/10 px-3 py-1 text-xs font-semibold text-[#3E3028] transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#F57923]" />
                        {post.likes}
                      </button>
                      {post.driveWebViewLink && (
                        <a
                          href={post.driveWebViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6C584C] hover:text-[#3E3028] underline underline-offset-2"
                        >
                          Ver en Drive
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingMutation({ type: 'delete', post })}
                      aria-label="Eliminar publicación de Google Drive"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6C584C] hover:text-[#9A3412] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explicit confirmation dialog for mutating / destructive Drive operations */}
      {pendingMutation && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3E3028]/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drive-confirm-title"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F0] border border-[#3E3028]/15 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setPendingMutation(null)}
              aria-label="Cancelar"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 flex items-center justify-center text-[#3E3028] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 id="drive-confirm-title" className="font-serif text-xl font-bold text-[#3E3028] pr-8">
              {pendingMutation.type === 'delete'
                ? '¿Eliminar publicación de Google Drive?'
                : '¿Actualizar reacción en Google Drive?'}
            </h4>
            <p className="text-sm text-[#6C584C] leading-relaxed">
              {pendingMutation.type === 'delete'
                ? `Esta acción eliminará permanentemente el archivo de "${pendingMutation.post.titulo || pendingMutation.post.autor}" de tu carpeta "muro" en Google Drive.`
                : `Se actualizará el archivo de "${pendingMutation.post.titulo || pendingMutation.post.autor}" en tu carpeta "muro" para sumar 1 reacción.`}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingMutation(null)}
                disabled={isMutating}
                className="rounded-full bg-[#FFF0DE] hover:bg-[#F7C99D]/60 text-[#3E3028] text-xs font-semibold px-4 py-2 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmMutation}
                disabled={isMutating}
                className="rounded-full bg-[#F57923] hover:bg-[#DF6613] text-[#FAF7F0] text-xs font-semibold px-5 py-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isMutating
                  ? 'Procesando...'
                  : pendingMutation.type === 'delete'
                    ? 'Confirmar eliminación'
                    : 'Confirmar actualización'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
