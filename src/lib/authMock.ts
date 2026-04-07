export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const auth = {
  currentUser: null as User | null,
};

let authStateListeners: ((user: User | null) => void)[] = [];

function notifyListeners() {
  authStateListeners.forEach(listener => listener(auth.currentUser));
}

// Check local storage for token on init
const initAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        auth.currentUser = {
          uid: String(data.user.id),
          email: data.user.email,
          displayName: data.user.name,
        };
      } else {
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.error(e);
    }
  }
  notifyListeners();
};

// Start initialization asynchronously
initAuth();

export const onAuthStateChanged = (authInstance: any, callback: (user: User | null) => void) => {
  authStateListeners.push(callback);
  // Immediate callback if we already have a state
  if (auth.currentUser || localStorage.getItem('token') === null) {
    setTimeout(() => callback(auth.currentUser), 0);
  }
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== callback);
  };
};

export const createUserWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName: email.split('@')[0] })
  });
  
  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(data.error || 'Server error');
    if (data.error === 'Email already in use') error.code = 'auth/email-already-in-use';
    throw error;
  }
  
  localStorage.setItem('token', data.token);
  const user: User = { uid: String(data.user.id), email: data.user.email, displayName: data.user.name };
  auth.currentUser = user;
  notifyListeners();
  
  return { user };
};

export const signInWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(data.error || 'Server error');
    if (data.error === 'Invalid email or password') error.code = 'auth/wrong-password';
    throw error;
  }
  
  localStorage.setItem('token', data.token);
  const user: User = { uid: String(data.user.id), email: data.user.email, displayName: data.user.name };
  auth.currentUser = user;
  notifyListeners();
  
  return { user };
};

export const updateProfile = async (user: User, profileInfo: { displayName: string }) => {
  // We already created the user with full-name mapped from email in creation, but we could update here if we had an endpoint.
  // For now we just update locally to mimic functionality.
  if (auth.currentUser && auth.currentUser.uid === user.uid) {
    auth.currentUser.displayName = profileInfo.displayName;
    notifyListeners();
  }
};

export class GoogleAuthProvider {}

export const signInWithPopup = async (authInstance: any, provider: any) => {
  throw new Error("Google Sign In not implemented with simple Neon Auth backend yet");
};

export const signOut = async (authInstance: any) => {
  localStorage.removeItem('token');
  auth.currentUser = null;
  notifyListeners();
};
