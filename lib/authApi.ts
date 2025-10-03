import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'mock/users';
const UPLOADS_KEY = 'mock/uploads';

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('[authApi.getUsers] error', e);
    return [];
  }
}

async function saveUsers(users: any[]) {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('[authApi.saveUsers] error', e);
  }
}

export const authApi = {
  login: async (data: { email?: string; phone?: string; password: string }) => {
    await new Promise(r => setTimeout(r, 500));
    
    const users = await getUsers();
    const user = users.find((u: any) => 
      (data.email && u.email === data.email) || 
      (data.phone && u.phone === data.phone)
    );
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    if (user.password !== data.password) {
      throw new Error('Mot de passe incorrect');
    }
    
    const token = `mock_token_${uid()}`;
    return { token, user: { ...user, password: undefined } };
  },
    
  register: async (payload: any) => {
    await new Promise(r => setTimeout(r, 500));
    
    const users = await getUsers();
    
    const exists = users.find((u: any) => 
      u.email === payload.email || u.phone === payload.phone
    );
    
    if (exists) {
      throw new Error('Un compte existe déjà avec cet email ou téléphone');
    }
    
    const user = {
      id: uid(),
      ...payload,
      createdAt: Date.now(),
      proStatus: payload.role === 'provider' ? 'pending_review' : 'none',
    };
    
    users.push(user);
    await saveUsers(users);
    
    const token = `mock_token_${uid()}`;
    return { token, user: { ...user, password: undefined } };
  },
    
  upload: async (file: { uri: string; name: string; type: string }) => {
    await new Promise(r => setTimeout(r, 300));
    
    const uploadId = uid();
    const mockUrl = file.uri;
    
    try {
      const uploads = await AsyncStorage.getItem(UPLOADS_KEY);
      const uploadsList = uploads ? JSON.parse(uploads) : [];
      uploadsList.push({ id: uploadId, url: mockUrl, name: file.name, createdAt: Date.now() });
      await AsyncStorage.setItem(UPLOADS_KEY, JSON.stringify(uploadsList));
    } catch (e) {
      console.warn('[authApi.upload] storage error', e);
    }
    
    return { url: mockUrl, id: uploadId };
  },
};