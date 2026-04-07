import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { COURSES } from '../../constants/courseData'

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      async queryFn() {
        try {
          const coursesRef = collection(db, 'courses')
          const snapshot = await getDocs(coursesRef)
          
          if (snapshot.empty) {
            // Return static data as fallback
            return { data: COURSES }
          }
          
          const courses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          return { data: courses }
        } catch (error) {
          // Fallback to static data on error
          return { data: COURSES }
        }
      },
      providesTags: ['Courses'],
    }),

    getCourseById: builder.query({
      async queryFn(courseId) {
        try {
          const courseRef = doc(db, 'courses', courseId)
          const courseDoc = await getDoc(courseRef)
          
          if (courseDoc.exists()) {
            return { data: { id: courseDoc.id, ...courseDoc.data() } }
          }
          
          // Fallback to static data
          const staticCourse = COURSES.find((c) => c.id === courseId || c.slug === courseId)
          if (staticCourse) return { data: staticCourse }
          
          return { error: { message: 'Course not found' } }
        } catch (error) {
          const staticCourse = COURSES.find((c) => c.id === courseId || c.slug === courseId)
          if (staticCourse) return { data: staticCourse }
          return { error: { message: error.message } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),

    getCoursesByCategory: builder.query({
      async queryFn(category) {
        try {
          const coursesRef = collection(db, 'courses')
          const q = query(coursesRef, where('category', '==', category))
          const snapshot = await getDocs(q)
          
          if (snapshot.empty) {
            const filtered = COURSES.filter((c) => c.category === category)
            return { data: filtered }
          }
          
          const courses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          return { data: courses }
        } catch (error) {
          const filtered = COURSES.filter((c) => c.category === category)
          return { data: filtered }
        }
      },
      providesTags: ['Courses'],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCategoryQuery,
} = coursesApi
