import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface UploadImage {
  name: string
  url: string
}

export function useFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadImage[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const user = useSelector((state: RootState) => state.auth.account)

  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map((file, index) => {
      const storageRef = ref(imgStorage, `images/${user?.id}/${file.name}`)
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

      return uploadTask
        .then(() => getDownloadURL(storageRef))
        .then(url => ({ name: file.name, url }))
    })

    try {
      const downloadUrls = await Promise.all(uploadTasks)
      // @ts-ignore
      setUploadedImages(prevImages => [...prevImages, ...downloadUrls])
      setUploadProgress([])
      console.log('All files uploaded')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchExistingImages = async () => {
      const storageRef = ref(imgStorage, `images/${user?.id}`)
      const imagesList = await listAll(storageRef)

      const existingImagesPromises = imagesList.items.map(item => {
        return getDownloadURL(item).then(url => ({
          name: item.name,
          url,
        }))
      })

      const existingImages = await Promise.all(existingImagesPromises)
      setUploadedImages([])
      setUploadedImages(prevImages => [...prevImages, ...existingImages])
    }
    fetchExistingImages()
    uploadMultipleImages(files)
  }, [files])

  return { user, files, uploadedImages, uploadProgress, setFiles }
}
