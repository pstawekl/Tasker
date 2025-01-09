import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

export default admin;

export const checkTokenFromRequest = async (req: Request): Promise<Boolean> => {
  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
      return false;
    }
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.uid) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
