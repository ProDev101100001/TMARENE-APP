
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  Auth
} from 'firebase/auth';

/**
 * تسجيل الدخول عبر Google
 */
export const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  return await signInWithPopup(auth, provider);
};

/**
 * تسجيل الدخول عبر Apple
 */
export const signInWithApple = async (auth: Auth) => {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return await signInWithPopup(auth, provider);
};

/**
 * تسجيل الدخول عبر Facebook
 */
export const signInWithFacebook = async (auth: Auth) => {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  return await signInWithPopup(auth, provider);
};
