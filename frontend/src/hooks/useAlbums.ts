import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { AccountResponse, AlbumResponse } from '@/redux/types'
import api from '@/utils/axios'
import { ref, uploadString } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useAlbums = () => {
  const [albums, setAlbums] = useState<AlbumResponse[]>([])
  const [publicAlbums, setPublicAlbums] = useState<AlbumResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)

  const fetchAlbums = async () => {
    setLoading(true)
    if (currentUser) {
      await api
        .get('/api/v1/albums/my/')
        .then(res => {
          setAlbums(res.data)
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    }
  }

  const fetchPublicAlbums = async () => {
    setLoading(true)
    await api
      .get('/api/v1/albums/')
      .then(res => {
        setPublicAlbums(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const createAlbum = async (
    albumName: string,
    currentUser: AccountResponse,
    _public?: boolean,
  ) => {
    try {
      setLoading(true)
      await api
        .post('/api/v1/albums/my/', {
          title: albumName,
          is_public: _public,
        })
        .then(async res => {
          console.log('created album', res.data)
          const storageRef = ref(
            imgStorage,
            `albums/${currentUser.id}/${albumName}/.folder`,
          )
          await uploadString(storageRef, JSON.stringify({ isFolder: true }))
          setLoading(false)
        })
        .catch(err => {
          console.log('error creating album', err)
          setLoading(false)
        })
    } catch (error) {
      console.error('Ошибка при создании альбома:', (error as Error).message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
    fetchPublicAlbums()
  }, [])

  return { loading, publicAlbums, albums, createAlbum }
}
export default useAlbums
