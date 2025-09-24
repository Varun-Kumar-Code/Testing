import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleAuthProvider, storage, db } from '@/lib/firebase';

// Types for authentication
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  photoURL: string;
  bannerURL?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

// Authentication error handling
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = 'unknown',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Convert Firebase auth errors to user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup request is allowed at a time.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Sign up with email and password
export const signUpWithEmail = async (userData: SignUpData): Promise<User> => {
  try {
    const { email, password, fullName } = userData;
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName
      });
    }
    
    // Send email verification
    await sendEmailVerification(user);
    
    return user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new AuthError(
      getAuthErrorMessage(error.code),
      error.code,
      error
    );
  }
};

// Sign in with email and password
export const signInWithEmail = async (userData: SignInData): Promise<User> => {
  try {
    const { email, password } = userData;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new AuthError(
      getAuthErrorMessage(error.code),
      error.code,
      error
    );
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const userCredential = await signInWithPopup(auth, googleAuthProvider);
    return userCredential.user;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    
    // Don't throw error if user cancelled the popup
    if (error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request') {
      throw new AuthError('Sign-in was cancelled.', error.code, error);
    }
    
    throw new AuthError(
      getAuthErrorMessage(error.code),
      error.code,
      error
    );
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new AuthError(
      getAuthErrorMessage(error.code),
      error.code,
      error
    );
  }
};

// Resend email verification
export const resendEmailVerification = async (): Promise<void> => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new AuthError('No user is currently signed in.');
    }
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw new AuthError(
      getAuthErrorMessage(error.code),
      error.code,
      error
    );
  }
};

// Update user profile
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
    } else {
      throw new AuthError('No user is currently signed in.');
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new AuthError(
      'Failed to update profile. Please try again.',
      error.code,
      error
    );
  }
};

// Check if email is available
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    // This is a workaround since Firebase doesn't provide a direct method
    // We'll try to create a user and catch the specific error
    await createUserWithEmailAndPassword(auth, email, 'temporary-password-check');
    return true; // Email is available (this shouldn't happen in normal flow)
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return false; // Email is not available
    }
    // For other errors, assume email is available
    return true;
  }
};

// Upload profile image to Firebase Storage with fallback
export const uploadProfileImage = async (file: File): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new AuthError('No user is currently logged in');
  }

  try {
    const imageRef = ref(storage, `profile-images/${user.uid}/profile.jpg`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error('Firebase Storage upload failed:', error);

    // Fallback: Store image as base64 in localStorage
    const base64 = await fileToBase64(file);
    localStorage.setItem(`profile_image_${user.uid}`, base64);
    return base64;
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Upload banner image to Firebase Storage with fallback
export const uploadBannerImage = async (file: File): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new AuthError('No user is currently logged in');
  }

  try {
    const imageRef = ref(storage, `profile-images/${user.uid}/banner.jpg`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error('Firebase Storage banner upload failed:', error);

    // Fallback: Store image as base64 in localStorage
    const base64 = await fileToBase64(file);
    localStorage.setItem(`banner_image_${user.uid}`, base64);
    return base64;
  }
};

// Enhanced profile update 
export const updateUserProfileData = async (profileData: {
  fullName?: string;
  photoURL?: string;
  bannerURL?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new AuthError('No user is currently logged in');
  }

  try {
    // Update Firebase Auth profile
    const updates: { displayName?: string; photoURL?: string } = {};
    if (profileData.fullName) {
      updates.displayName = profileData.fullName;
    }
    if (profileData.photoURL) {
      updates.photoURL = profileData.photoURL;
    }

    if (Object.keys(updates).length > 0) {
      await updateProfile(user, updates);
      // Reload user to ensure profile changes are reflected
      await user.reload();
    }

    // Update Firestore profile data
    const profileRef = doc(db, 'users', user.uid);
    const firestoreData: Partial<UserProfile> = {};
    
    if (profileData.bannerURL !== undefined) firestoreData.bannerURL = profileData.bannerURL;
    if (profileData.phone !== undefined) firestoreData.phone = profileData.phone;
    if (profileData.address !== undefined) firestoreData.address = profileData.address;
    if (profileData.city !== undefined) firestoreData.city = profileData.city;
    if (profileData.country !== undefined) firestoreData.country = profileData.country;

    if (Object.keys(firestoreData).length > 0) {
      await setDoc(profileRef, firestoreData, { merge: true });
    }

    console.log('Profile updated successfully');
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new AuthError(getAuthErrorMessage(error.code));
  }
};

// Get user profile data
export const getUserProfile = async (): Promise<UserProfile> => {
  const user = auth.currentUser;
  if (!user) {
    throw new AuthError('No user is currently logged in');
  }

  try {
    // Get data from Firebase Auth
    let profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      fullName: user.displayName || '',
      photoURL: user.photoURL || '',
      bannerURL: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    };

    // Get additional data from Firestore
    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const firestoreData = profileSnap.data();
      profile = {
        ...profile,
        bannerURL: firestoreData.bannerURL || '',
        phone: firestoreData.phone || '',
        address: firestoreData.address || '',
        city: firestoreData.city || '',
        country: firestoreData.country || ''
      };
    }

    return profile;
  } catch (error: any) {
    console.error('Get profile error:', error);
    throw new AuthError(getAuthErrorMessage(error.code));
  }
};

// Sign out user
export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
    console.log('User signed out successfully');
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new AuthError(getAuthErrorMessage(error.code));
  }
};
