import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../../lib/firebase'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    loginWithEmail: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password)
          const userDoc = await getDoc(doc(db, 'users', result.user.uid))
          const userData = userDoc.exists() ? userDoc.data() : {}
          return {
            data: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              ...userData,
            },
          }
        } catch (error) {
          return { error: { message: error.message, code: error.code } }
        }
      },
    }),

    registerWithEmail: builder.mutation({
      async queryFn({ email, password, name, phone, city }) {
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(result.user, { displayName: name })
          
          const userData = {
            name,
            email,
            phone: phone || '',
            city: city || '',
            role: 'student',
            createdAt: serverTimestamp(),
          }
          
          await setDoc(doc(db, 'users', result.user.uid), userData)
          
          return {
            data: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: name,
              ...userData,
            },
          }
        } catch (error) {
          return { error: { message: error.message, code: error.code } }
        }
      },
    }),

    loginWithGoogle: builder.mutation({
      async queryFn() {
        try {
          const result = await signInWithPopup(auth, googleProvider)
          const uid = result.user.uid
          
          let userData = {
            name: result.user.displayName,
            email: result.user.email,
            phone: '',
            city: '',
            role: 'student',
          }

          try {
            const userRef = doc(db, 'users', uid)
            const userDoc = await getDoc(userRef)
            
            if (!userDoc.exists()) {
              await setDoc(userRef, {
                ...userData,
                createdAt: serverTimestamp(),
              })
            } else {
              userData = userDoc.data()
            }
          } catch (firestoreError) {
            console.warn("Firestore error during Google Login (Write might be blocked by AdBlocker or Security Rules):", firestoreError)
            // Continue login even if Firestore fails
          }
          
          return {
            data: {
              uid: uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              ...userData,
            },
          }
        } catch (error) {
          return { error: { message: error.message, code: error.code } }
        }
      },
    }),

    logout: builder.mutation({
      async queryFn() {
        try {
          await signOut(auth)
          return { data: null }
        } catch (error) {
          return { error: { message: error.message } }
        }
      },
    }),
  }),
})

export const {
  useLoginWithEmailMutation,
  useRegisterWithEmailMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation,
} = authApi
