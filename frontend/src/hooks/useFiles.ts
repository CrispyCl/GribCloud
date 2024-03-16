import { VideoType } from '@/constants'
import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { AlbumResponse, UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export function useFiles(path: string[]) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadImageResponse[]>(
    [],
  )
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>('.')
  const [response, setResponse] = useState<UploadImageResponse>()
  const existPromise = useRef<Promise<any>[]>([])
  const hrefRef = useRef('')
  const apiHrefRef = useRef('')

  const getHref = (path: string[] = [], file?: File) => {
    if (path && path.includes('album')) {
      console.log('in album')
      hrefRef.current = `albums/${path[4]}/${path[3]}/${file}`
      apiHrefRef.current = `/api/v1/albums/${path[4]}/`
    } else if (path && path.includes('publicalbums')) {
      console.log('in public album')
      hrefRef.current = `publicalbums/${path[4]}/${path[3]}/${file}`
      apiHrefRef.current = `/api/v1/albums/${path[4]}/`
    } else {
      console.log('in images')
      hrefRef.current = `images/${currentUser?.id}/${file}`
      apiHrefRef.current = `/api/v1/files/`
    }
  }
  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map(async (file, index) => {
      getHref(path, file)
      const storageRef = ref(imgStorage, hrefRef.current)
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
      if (apiHrefRef.current === '/api/v1/files/') {
        api
          .post('/api/v1/files/', {
            files: [[`images/${currentUser?.id}/${file.name}`, preview]],
          })
          .then(res =>
            res.data.map((item: UploadImageResponse) => setResponse(item)),
          )
      } else if (
        apiHrefRef.current ===
        `/api/v1/albums/${window.location.href.split('/')[4]}/`
      ) {
        api
          .put(apiHrefRef.current, {
            files: [
              [`/api/v1/albums/${window.location.href.split('/')[4]}`, preview],
            ],
          })
          .then(res =>
            res.data.map((item: UploadImageResponse) => setResponse(item)),
          )
      }

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
        console.log(apiHrefRef.current)
        if (apiHrefRef.current === '/api/v1/files/') {
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
          existPromise.current = existingImagesPromises
        } else if (
          apiHrefRef.current ===
          `/api/v1/albums/${window.location.href.split('/')[4]}/`
        ) {
          const response = await api.get(
            `/api/v1/albums/${window.location.href.split('/')[4]}/`,
          )
          const existingImagesPromises = response.data.map(
            async (item: AlbumResponse) => {
              const filesPromises = item.files.map(async file => {
                const url = await getDownloadURL(ref(imgStorage, file.file))
                return {
                  title: item.title,
                  author: item.author,
                  created_at: new Date(item.created_at),
                  id: item.id,
                  files: [
                    {
                      name: file.file.split('/')[2],
                      author: file.author,
                      created_at: new Date(file.created_at),
                      file: file.file,
                      id: file.id,
                      url: url,
                      preview: file.preview,
                    },
                  ],
                }
              })

              return await Promise.all(filesPromises)
            },
          )
          existPromise.current = existingImagesPromises
          console.log(existPromise)
        }

        const existingImages = await Promise.all(existPromise.current)
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
    getHref(path)
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
