import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export function useFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadImageResponse[]>(
    [],
  )
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.account)

  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map(async (file, index) => {
      const storageRef = ref(
        imgStorage,
        `images/${currentUser?.id}/${file.name}`,
      )
      await api.post('/api/v1/files/', {
        files: [`images/${currentUser?.id}/${file.name}`],
      })
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', snapshot => {
        // Отслеживание прогресса загрузки
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        const progressArray = [...uploadProgress]
        progressArray[index] = progress
        setUploadProgress(progressArray)
      })

      return await uploadTask.then(async snapshot => {
        const url = await getDownloadURL(snapshot.ref)
        return {
          name: file.name,
          author: currentUser?.id,
          created_at: new Date(),
          file: `images/${currentUser?.id}/${file.name}`,
          id: undefined,
          url: url,
        }
      })
    })

    try {
      const downloadUrls = await Promise.all(uploadTasks)
      // @ts-ignore
      setUploadedImages(prevImages => [...downloadUrls, ...prevImages])
      setUploadProgress([])
      console.log('All files uploaded')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        const response = await api.get('/api/v1/files/')
        const existingImagesPromises = response.data.map(
          (item: UploadImageResponse) => {
            return getDownloadURL(ref(imgStorage, item.file)).then(url => ({
              name: item.file.split('/')[2],
              author: item.author,
              created_at: new Date(item.created_at),
              file: item.file,
              id: item.id,
              url: url,
            }))
          },
        )
        const existingImages = await Promise.all(existingImagesPromises)
        existingImages.sort((a, b) => {
          const dateA = new Date(a.created_at.getHours())
          const dateB = new Date(b.created_at.getHours())

          if (dateA > dateB) return -1
          if (dateA < dateB) return 1

          // Если дни одинаковые, сортируем по времени
          return b.created_at.getTime() - a.created_at.getTime()
        })
        setUploadedImages([])
        setUploadedImages(prevImages => [...existingImages, ...prevImages])
      } catch (error) {
        console.error('Error fetching existing images:', error)
      }
    }
    uploadMultipleImages(files)
    fetchExistingImages()
  }, [files])

  return { files, uploadedImages, uploadProgress, setFiles }
}
