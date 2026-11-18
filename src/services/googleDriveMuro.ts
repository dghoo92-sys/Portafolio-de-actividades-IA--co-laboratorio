import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'consent',
});

// Token cached strictly in memory (never localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const MURO_FOLDER_NAME = 'muro';

export interface MuroDriveFolder {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface MuroDrivePost {
  driveFileId: string;
  driveWebViewLink?: string;
  tipo: 'mapas' | 'retos';
  autor: string;
  titulo?: string;
  enlace?: string;
  texto?: string;
  retoIndex?: number;
  retoNivel?: string;
  retoConsigna?: string;
  herramienta?: string;
  prompt?: string;
  resultado?: string;
  likes: number;
  creadoEn: string;
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.(user);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.(null);
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se recibió el token de acceso de Google Drive.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

async function driveFetch(url: string, accessToken: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401) {
    cachedAccessToken = null;
    throw new Error('AUTH_EXPIRED');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Drive API error (${response.status}): ${errorText}`);
  }

  return response;
}

export async function ensureMuroFolder(accessToken: string): Promise<MuroDriveFolder> {
  const query = encodeURIComponent(
    "mimeType = 'application/vnd.google-apps.folder' and trashed = false and (name = 'muro' or name = 'Muro')"
  );
  const fields = encodeURIComponent('files(id,name,webViewLink)');
  const listRes = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&spaces=drive&orderBy=createdTime asc`,
    accessToken
  );
  const listData = (await listRes.json()) as { files?: MuroDriveFolder[] };

  if (listData.files && listData.files.length > 0) {
    const exactMatch = listData.files.find((f) => f.name === MURO_FOLDER_NAME);
    return exactMatch ?? listData.files[0];
  }

  const createRes = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?fields=${encodeURIComponent('id,name,webViewLink')}`,
    accessToken,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: MURO_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    }
  );

  return (await createRes.json()) as MuroDriveFolder;
}

export async function listMuroPosts(
  accessToken: string,
  folderId: string
): Promise<MuroDrivePost[]> {
  const query = encodeURIComponent(
    `'${folderId}' in parents and trashed = false and mimeType = 'application/json'`
  );
  const fields = encodeURIComponent('files(id,name,createdTime,webViewLink)');
  const listRes = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=createdTime desc&pageSize=100`,
    accessToken
  );
  const listData = (await listRes.json()) as {
    files?: { id: string; name: string; createdTime?: string; webViewLink?: string }[];
  };

  const files = listData.files ?? [];
  if (files.length === 0) return [];

  const posts = await Promise.all(
    files.map(async (file): Promise<MuroDrivePost | null> => {
      try {
        const contentRes = await driveFetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          accessToken
        );
        const parsed = (await contentRes.json()) as Partial<MuroDrivePost>;
        if (parsed.tipo !== 'mapas' && parsed.tipo !== 'retos') {
          return null;
        }
        return {
          driveFileId: file.id,
          driveWebViewLink: file.webViewLink,
          tipo: parsed.tipo,
          autor: parsed.autor || 'Anónimo',
          titulo: parsed.titulo,
          enlace: parsed.enlace,
          texto: parsed.texto,
          retoIndex: parsed.retoIndex,
          retoNivel: parsed.retoNivel,
          retoConsigna: parsed.retoConsigna,
          herramienta: parsed.herramienta,
          prompt: parsed.prompt,
          resultado: parsed.resultado,
          likes: typeof parsed.likes === 'number' ? parsed.likes : 0,
          creadoEn: parsed.creadoEn || file.createdTime || new Date().toISOString(),
        };
      } catch {
        return null;
      }
    })
  );

  return posts.filter((item): item is MuroDrivePost => item !== null);
}

function slugifyFilePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);
}

export async function publishMuroPost(
  accessToken: string,
  folderId: string,
  payload: Omit<MuroDrivePost, 'driveFileId' | 'driveWebViewLink'>
): Promise<MuroDrivePost> {
  const baseLabel =
    payload.tipo === 'mapas'
      ? slugifyFilePart(payload.titulo || payload.autor || 'mapa')
      : slugifyFilePart(payload.autor || 'reto');
  const fileName = `${payload.tipo === 'mapas' ? 'mapa' : 'reto'}_${baseLabel || 'respuesta'}_${Date.now()}.json`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
    description:
      payload.tipo === 'mapas'
        ? `Mapa mental publicado en Muro QR por ${payload.autor}`
        : `Reto de IA publicado en Muro QR por ${payload.autor}`,
  };

  const fileContent = JSON.stringify(payload, null, 2);
  const boundary = `muro_qr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${fileContent}\r\n` +
    `--${boundary}--`;

  const res = await driveFetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=${encodeURIComponent('id,name,webViewLink,createdTime')}`,
    accessToken,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  const created = (await res.json()) as {
    id: string;
    webViewLink?: string;
    createdTime?: string;
  };

  return {
    ...payload,
    driveFileId: created.id,
    driveWebViewLink: created.webViewLink,
  };
}

export async function updateMuroPostLikes(
  accessToken: string,
  post: MuroDrivePost
): Promise<MuroDrivePost> {
  const updatedPayload: Omit<MuroDrivePost, 'driveFileId' | 'driveWebViewLink'> = {
    tipo: post.tipo,
    autor: post.autor,
    titulo: post.titulo,
    enlace: post.enlace,
    texto: post.texto,
    retoIndex: post.retoIndex,
    retoNivel: post.retoNivel,
    retoConsigna: post.retoConsigna,
    herramienta: post.herramienta,
    prompt: post.prompt,
    resultado: post.resultado,
    likes: post.likes + 1,
    creadoEn: post.creadoEn,
  };

  await driveFetch(
    `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(post.driveFileId)}?uploadType=media`,
    accessToken,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(updatedPayload, null, 2),
    }
  );

  return {
    ...post,
    likes: post.likes + 1,
  };
}

export async function deleteMuroPost(accessToken: string, fileId: string): Promise<void> {
  await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    accessToken,
    {
      method: 'DELETE',
    }
  );
}
