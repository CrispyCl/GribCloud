import { VideoType } from '@/constants'
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
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>('.')
  const [response, setResponse] = useState<UploadImageResponse>()

  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map(async (file, index) => {
      const storageRef = ref(
        imgStorage,
        `images/${currentUser?.id}/${file.name}`,
      )
      if (VideoType.includes(file.type)) {
        const video = document.createElement('video')
        const url = URL.createObjectURL(file)
        video.src = url
        video.onloadeddata = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const previewUrl = canvas.toDataURL('image/jpeg')

            const previewBlob = await fetch(previewUrl).then(res => res.blob())
            const previewStorageRef = ref(
              imgStorage,
              `previews/${currentUser?.id}/${file.name}.jpeg`,
            )
            const previewUploadTask = uploadBytesResumable(
              previewStorageRef,
              previewBlob,
            )

            previewUploadTask.on(
              'state_changed',
              snapshot => {
                // Отслеживание прогресса загрузки
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                )
                const progressArray = [...uploadProgress]
                progressArray[index] = progress
                setUploadProgress(progressArray)
              },
              error => {
                console.error('Failed to upload preview:', error)
              },
            )

            try {
              await previewUploadTask
              const previewUrl = await getDownloadURL(previewStorageRef)
              console.log('Preview uploaded:', previewUrl)
              setPreview(previewUrl)
              // Здесь вы можете обработать URL превью-изображения, если необходимо
            } catch (error) {
              console.error('Error uploading preview:', error)
            }
          }
        }
      }

      api
        .post('/api/v1/files/', {
          files: [[`images/${currentUser?.id}/${file.name}`, preview]],
        })
        .then(res =>
          res.data.map((item: UploadImageResponse) => setResponse(item)),
        )
      console.log(1313131231, response)

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

      const snapshot = await uploadTask
      const url = await getDownloadURL(snapshot.ref)
      return {
        name: file.name,
        author: response?.author,
        created_at: new Date(),
        file: response?.file,
        id: response?.id,
        url: url,
        preview: preview,
      }
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
        setLoading(true)
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
              preview: item.preview,
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
        setLoading(false)
        setUploadedImages([])
        setUploadedImages(prevImages => [...existingImages, ...prevImages])
      } catch (error) {
        setLoading(false)
        console.error('Error fetching existing images:', error)
      }
    }
    uploadMultipleImages(files)
    fetchExistingImages()
  }, [files])

  return {
    loading,
    files,
    uploadedImages,
    uploadProgress,
    setFiles,
  }
}
