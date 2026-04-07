import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { setUser, clearUser, setLoading } from '../features/auth/authSlice'

export function useAuth() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          const userData = userDoc.exists() ? userDoc.data() : {}
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userData,
          }))
        } catch {
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }))
        }
      } else {
        dispatch(clearUser())
      }
    })

    return () => unsubscribe()
  }, [dispatch])
}
