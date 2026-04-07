import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export const enrollmentsApi = createApi({
  reducerPath: 'enrollmentsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Enrollments'],
  endpoints: (builder) => ({
    createEnrollment: builder.mutation({
      async queryFn(enrollmentData) {
        try {
          const docRef = await addDoc(collection(db, 'enrollments'), {
            ...enrollmentData,
            status: 'pending',
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id, ...enrollmentData, status: 'pending' } }
        } catch (error) {
          return { error: { message: error.message } }
        }
      },
      invalidatesTags: ['Enrollments'],
    }),

    getMyEnrollments: builder.query({
      async queryFn(userId) {
        try {
          const enrollRef = collection(db, 'enrollments')
          const q = query(
            enrollRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          )
          const snapshot = await getDocs(q)
          const enrollments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          return { data: enrollments }
        } catch (error) {
          return { error: { message: error.message } }
        }
      },
      providesTags: ['Enrollments'],
    }),

    createInquiry: builder.mutation({
      async queryFn(inquiryData) {
        try {
          const docRef = await addDoc(collection(db, 'inquiries'), {
            ...inquiryData,
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id, ...inquiryData } }
        } catch (error) {
          return { error: { message: error.message } }
        }
      },
    }),
  }),
})

export const {
  useCreateEnrollmentMutation,
  useGetMyEnrollmentsQuery,
  useCreateInquiryMutation,
} = enrollmentsApi
