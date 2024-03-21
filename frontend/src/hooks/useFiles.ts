import { VideoType } from '@/constants'
import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { AlbumResponse, UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import Compressor from 'compressorjs'
import exifr from 'exifr'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
export function useFiles(path: string[], title?: string, tagKey?: number) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadImageResponse[]>(
    [],
  )
  const [uploadProgress, setUploadProgress] = useState<
    { id: number; progress: number } | undefined
  >(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const latitude = useRef<number>(0)
  const longitude = useRef<number>(0)
  const countryRef = useRef<string>('')
  const cityRef = useRef<string>('')
  const multiUpload = useRef<UploadImageResponse[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const responseRef = useRef<UploadImageResponse | null>(null)
  const AlbumResponse = useRef<AlbumResponse | null>(null)
  const existPromise = useRef<Promise<any>[]>([])
  const apiHrefRef = useRef('')

  const getHref = (path: string[]) => {
    if (path[4] && path.includes('album')) {
      apiHrefRef.current = `/api/v1/albums/${path[4]}/`
    } else {
      apiHrefRef.current = `/api/v1/files/`
    }
  }

  const compressImage = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.4,
        success(result) {
          const previewBlob = new Blob([result], { type: 'image/jpeg' })
          const previewStorageRef = ref(
            imgStorage,
            `previews/${currentUser?.id}/${file.name}`,
          )
          const previewUploadTask = uploadBytesResumable(
            previewStorageRef,
            previewBlob,
          )
          previewUploadTask
            .then(async () => {
              const previewUrl = await getDownloadURL(previewStorageRef)
              resolve(previewUrl)
            })
            .catch(reject)
        },
      })
    })
  }

  const getCityAndCountryFromCoordinates = async (
    latitude: number,
    longitude: number,
  ): Promise<{ city: string; country: string }> => {
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_GEOCODER_KEY}&format=json&geocode=${longitude},${latitude}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      const featureMember = data.response.GeoObjectCollection.featureMember[0]

      const addressDetails =
        featureMember.GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails
      const country = addressDetails.Country.CountryName
      const city =
        addressDetails.Country.AdministrativeArea.AdministrativeAreaName
      return { city, country }
    } catch (error) {
      console.error('Error fetching data:', error)
      return { city: '', country: '' }
    }
  }

  const uploadMultipleImages = async (files: File[]): Promise<void> => {
    const uploadTasks = files.map(async file => {
      getHref(path)
      const storageRef = ref(
        imgStorage,
        `images/${currentUser?.id}/${file.name}`,
      )

      // Get metadata
      const getMetadata = async (file: File) => {
        try {
          const exif = await exifr.parse(file)
          latitude.current = exif?.latitude || 0
          longitude.current = exif?.longitude || 0
          return latitude && longitude
        } catch (error) {
          console.error('Error getting metadata:', error)
        }
      }
      if (!VideoType.includes(file.type) && file.type !== 'image/gif') {
        const preview = await compressImage(file)
        getMetadata(file).then(async () => {
          if (latitude.current !== 0 && longitude.current !== 0) {
            getCityAndCountryFromCoordinates(
              latitude.current,
              longitude.current,
            ).then(async ({ city, country }) => {
              console.log(city, country)
              countryRef.current = country
              cityRef.current = city
              await api
                .post('/api/v1/files/', {
                  files: [
                    {
                      file: `images/${currentUser?.id}/${file.name}`,
                      preview: preview,
                      geodata: {
                        latitude: latitude.current,
                        longitude: longitude.current,
                        country: country,
                        city: city,
                      },
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
                            },
                          ],
                        },
                      )
                      .then(res => {
                        AlbumResponse.current = res.data
                      })
                  }
                })
            })
          } else {
            await api
              .post('/api/v1/files/', {
                files: [
                  {
                    file: `images/${currentUser?.id}/${file.name}`,
                    preview: preview,
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
                          },
                        ],
                      },
                    )
                    .then(res => {
                      AlbumResponse.current = res.data
                    })
                }
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
            geoData: {
              latitude: latitude.current,
              longitude: longitude.current,
              country: countryRef.current,
              city: cityRef.current,
            },
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
                geoData: {
                  latitude: latitude.current,
                  longitude: longitude.current,
                  country: countryRef.current,
                  city: cityRef.current,
                },
                id: responseRef.current?.id,
                url: url,
                preview: preview,
              },
            ],
          }
        }
      } else {
        const preview = '/video-placeholder.webp'
        if (latitude.current !== 0 && longitude.current !== 0) {
          await api
            .post('/api/v1/files/', {
              files: [
                {
                  file: `images/${currentUser?.id}/${file.name}`,
                  preview: preview,
                  geodata: {
                    latitude: latitude.current,
                    longitude: longitude.current,
                    country: countryRef.current,
                    city: cityRef.current,
                  },
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
                        },
                      ],
                    },
                  )
                  .then(res => {
                    AlbumResponse.current = res.data
                  })
              }
            })
        } else {
          await api
            .post('/api/v1/files/', {
              files: [
                {
                  file: `images/${currentUser?.id}/${file.name}`,
                  preview: preview,
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
                        },
                      ],
                    },
                  )
                  .then(res => {
                    AlbumResponse.current = res.data
                  })
              }
            })
        }

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
            geoData: {
              latitude: latitude.current,
              longitude: longitude.current,
              country: countryRef.current,
              city: cityRef.current,
            },
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
                geoData: {
                  latitude: latitude.current,
                  longitude: longitude.current,
                  country: countryRef.current,
                  city: cityRef.current,
                },
                id: responseRef.current?.id,
                url: url,
                preview: preview,
              },
            ],
          }
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
      setLoading(true)
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
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
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
            geodata: item.geodata,
            id: item.id,
            url: url,
            preview: item.preview,
            tags: item.tags,
          }
        })
        existPromise.current = existingImagesPromises
        const existingImages = await Promise.all(existPromise.current)

        setUploadedImages([])
        setUploadedImages(prevImages => [...existingImages, ...prevImages])
      } catch (error) {
        console.error('Error fetching existing images:', error)
      }
    }

    const uploadAndFetchImages = async () => {
      try {
        await uploadMultipleImages(files)
        await fetchExistingImages()
      } catch (error) {
        console.error('Error uploading or fetching images:', error)
      } finally {
        setLoading(false)
      }
    }

    getHref(path)
    uploadAndFetchImages()
  }, [files, tagKey])

  // Remove file
  const removeFile = async (id: number, path: string) => {
    try {
      setLoading(true)
      const res = await api.delete(`/api/v1/files/${id}/`)
      deleteObject(ref(imgStorage, path))
      return res.data
    } catch (error) {
      console.error('Error removing file:', error)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  return {
    loading,
    files,
    uploadedImages,
    uploadProgress,
    setFiles,
    removeFile,
  }
}
