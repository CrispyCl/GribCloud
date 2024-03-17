import { VideoType } from '@/constants'
import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { AlbumResponse, UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export function useFiles(path: string[], title?: string) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadImageResponse[]>(
    [],
  )
  const [uploadProgress, setUploadProgress] = useState<
    { id: number; progress: number } | undefined
  >(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>('.')
  const multiUpload = useRef<UploadImageResponse[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const responseRef = useRef<UploadImageResponse | null>(null)
  const AlbumResponse = useRef<AlbumResponse | null>(null)
  const existPromise = useRef<Promise<any>[]>([])
  const apiHrefRef = useRef('')

  const getHref = (path: string[]) => {
    if (path[4] && (path.includes('album') || path.includes('publicalbum'))) {
      apiHrefRef.current = `/api/v1/albums/${path[4]}/`
    } else {
      apiHrefRef.current = `/api/v1/files/`
    }
  }
  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map(async (file, index) => {
      getHref(path)
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

            try {
              await previewUploadTask
              const previewUrl = await getDownloadURL(previewStorageRef)
              setPreview(previewUrl)
              // Здесь вы можете обработать URL превью-изображения, если необходимо
            } catch (error) {
              console.error('Error uploading preview:', error)
            }
          }
        }
      }

      await api
        .post('/api/v1/files/', {
          files: [
            {
              file: `images/${currentUser?.id}/${file.name}`,
              preview: preview,
              geodata: {},
            },
          ],
        })
        .then(res => {
          res.data.forEach(
            (item: UploadImageResponse) => (responseRef.current = item),
          )
        })
        .then(async () => {
          if (apiHrefRef.current === `/api/v1/albums/${path[4]}/`) {
            await api
              .post(
                `/api/v1/albums/${path[4]}/files/${responseRef.current?.id}/`,
                {
                  files: [
                    {
                      file: `albums/${currentUser?.id}/${title}/${file.name}`,
                      preview: preview,
                      geodata: {},
                    },
                  ],
                },
              )
              .then(res => {
                AlbumResponse.current = res.data
              })
          }
        })
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        setUploadProgress({
          id: responseRef.current?.id as number,
          progress: progress,
        })
      })

      const snapshot = await uploadTask
      const url = await getDownloadURL(snapshot.ref)
      if (apiHrefRef.current === '/api/v1/files/') {
        return {
          name: file.name,
          author: currentUser?.id,
          created_at: responseRef.current?.created_at
            ? new Date(responseRef.current.created_at)
            : undefined,
          file: responseRef.current?.file,
          id: responseRef.current?.id,
          url: url,
          preview: preview,
        }
      } else if (apiHrefRef.current === `/api/v1/albums/${path[4]}/`) {
        return {
          title: AlbumResponse.current?.title,
          author: AlbumResponse.current?.author,
          created_at: AlbumResponse.current?.created_at
            ? new Date(AlbumResponse.current.created_at)
            : undefined,
          id: AlbumResponse.current?.id,
          memberships: AlbumResponse.current?.memberships,
          files: [
            {
              name: file.name,
              author: currentUser?.id,
              created_at: responseRef.current?.created_at
                ? new Date(responseRef.current.created_at)
                : undefined,
              file: responseRef.current?.file,
              id: responseRef.current?.id,
              url: url,
              preview: preview,
            },
          ],
        }
      }
    })

    const processFiles = (files: UploadImageResponse[]) => {
      const sortedFiles = files.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
      setUploadedImages(prevImages => [...sortedFiles, ...prevImages])
    }

    try {
      const downloadUrls = await Promise.all(uploadTasks.filter(Boolean))

      if (apiHrefRef.current === '/api/v1/files/') {
        // @ts-ignore
        processFiles(downloadUrls)
      } else if (apiHrefRef.current === `/api/v1/albums/${path[4]}/`) {
        const newFiles: UploadImageResponse[] = []
        // @ts-ignore
        downloadUrls.forEach((item: AlbumResponse) => {
          item.files.forEach((file: UploadImageResponse) => {
            if (
              !multiUpload.current.some(
                existingFile => existingFile.id === file.id,
              )
            ) {
              newFiles.push(file)
            }
          })
        })
        processFiles(newFiles)
      }
      setUploadProgress(undefined)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        setLoading(true)
        const response = await api.get(
          currentUser
            ? apiHrefRef.current === '/api/v1/files/'
              ? apiHrefRef.current
              : `/api/v1/albums/${path[4]}/`
            : '/api/v1/albums/',
        )
        const existingImagesPromises = (
          currentUser
            ? apiHrefRef.current === '/api/v1/files/'
              ? response.data
              : response.data.files
            : response.data[0].files
        ).map(async (item: UploadImageResponse) => {
          const url = await getDownloadURL(ref(imgStorage, item.file))
          return {
            name: item.file.split('/')[2],
            author: item.author,
            created_at: new Date(item.created_at),
            file: item.file.split('/')[2],
            id: item.id,
            url: url,
            preview: item.preview,
          }
        })
        existPromise.current = existingImagesPromises
        const existingImages = await Promise.all(existPromise.current)

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
