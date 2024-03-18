import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { AccountResponse, AlbumResponse } from '@/redux/types'
import api from '@/utils/axios' // Импортируйте actions
import {
  fetchAlbumsFailure,
  fetchAlbumsStart,
  fetchAlbumsSuccess,
} from '@store/slices/albums'
import {
  fetchPublicAlbumsFailure,
  fetchPublicAlbumsStart,
  fetchPublicAlbumsSuccess,
} from '@store/slices/publicAlbums'
import { ref, uploadString } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useAlbums = (path?: string[]) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const albums = useSelector((state: RootState) => state.albums.albums)
  const publicAlbums = useSelector(
    (state: RootState) => state.publicAlbums.albums,
  )
  // fetching albums
  const fetchAlbums = async () => {
    dispatch(fetchAlbumsStart())
    try {
      const res = await api.get('/api/v1/albums/my/')
      dispatch(fetchAlbumsSuccess(res.data))
    } catch (err: any) {
      console.log(err)
      dispatch(fetchAlbumsFailure(err.toString()))
    }
  }

  const fetchPublicAlbums = async () => {
    dispatch(fetchPublicAlbumsStart())
    try {
      const res = await api.get('/api/v1/albums/')
      dispatch(fetchPublicAlbumsSuccess(res.data))
    } catch (err: any) {
      console.log(err)
      dispatch(fetchPublicAlbumsFailure(err.toString()))
    }
  }

  // edit album
  const editAlbum = async (
    albumId: number,
    title: string,
    is_public: boolean,
  ) => {
    try {
      if (is_public) dispatch(fetchPublicAlbumsStart())
      else dispatch(fetchAlbumsStart())
      await api
        .patch(`/api/v1/albums/${albumId}/`, {
          title: title,
          is_public: is_public,
        })
        .then(res => {
          if (is_public) {
            dispatch(fetchPublicAlbumsSuccess(res.data))
            fetchPublicAlbums()
          } else {
            dispatch(fetchAlbumsSuccess(res.data))
            fetchAlbums()
          }
        })
        .catch(err => {
          console.log(err)
          if (is_public) dispatch(fetchPublicAlbumsFailure(err.toString()))
          else dispatch(fetchAlbumsFailure(err.toString()))
        })
    } catch (error) {
      console.error(
        'Ошибка при редактировании альбома:',
        (error as Error).message,
      )
      if (is_public)
        dispatch(fetchPublicAlbumsFailure((error as Error).message))
      else dispatch(fetchAlbumsFailure((error as Error).message))
    }
  }

  // Fetch members of album
  const fetchMembers = async (albumId: number) => {
    dispatch(fetchAlbumsStart())
    await api
      .get(`/api/v1/albums/${albumId}/members/${currentUser?.id}`)
      .then(res => {
        console.log('members', res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  // Create album
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
          if (_public) fetchPublicAlbums()
          else fetchAlbums()
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

  // Add member to album
  const addMemberToAlbum = async (userId: number, is_redactor: boolean) => {
    try {
      setLoading(true)
      await api
        .post(`/api/v1/albums/${path && path[4]}/members/${userId}/`, {
          is_redactor: is_redactor,
        })
        .then(res => {
          console.log('added member to album', res.data)
          setLoading(false)
        })
        .catch(err => {
          console.log('error adding member to album', err)
          setLoading(false)
        })
    } catch (error) {
      console.error(
        'Ошибка при добавлении участника в альбом:',
        (error as Error).message,
      )
      setLoading(false)
    }
  }

  // Remove member from album
  const removeMemberFromAlbum = async (userId: number) => {
    try {
      setLoading(true)
      await api
        .delete(`/api/v1/albums/${path && path[4]}/members/${userId}/`)
        .then(res => {
          console.log('removed member from album', res.data)
          setLoading(false)
        })
        .catch(err => {
          console.log('error removing member from album', err)
          setLoading(false)
        })
    } catch (error) {
      console.error(
        'Ошибка при удалении участника из альбома:',
        (error as Error).message,
      )
      setLoading(false)
    }
  }

  // Remove image from album
  const removeImageFromAlbum = async (album: AlbumResponse, image: number) => {
    try {
      setLoading(true)
      await api
        .delete(`/api/v1/albums/${album.id}/files/${image}/`)
        .then(res => {
          if (album.is_public) {
            dispatch(fetchAlbumsSuccess(res.data))
          } else {
            dispatch(fetchPublicAlbumsSuccess(res.data))
          }
        })
      fetchAlbums()
      fetchPublicAlbums()
      setLoading(false)
    } catch (error) {
      console.error(
        'Ошибка при удалении изображения из альбома:',
        (error as Error).message,
      )
      setLoading(false)
    }
  }

  // Remove album
  const removeAlbum = async (album: AlbumResponse) => {
    try {
      setLoading(true)
      album.files.forEach(async file => {
        await api.delete(`/api/v1/files/${file.id}/`)
      })
      await api
        .delete(`/api/v1/albums/${album.id}/`)
        .then(() => {
          setLoading(false)
        })
        .catch(err => {
          console.log('error removing album', err)
          setLoading(false)
        })
    } catch (error) {
      console.error('Ошибка при удалении альбома:', (error as Error).message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
    fetchPublicAlbums()
  }, [currentUser])

  return {
    loading,
    albums,
    publicAlbums,
    createAlbum,
    editAlbum,
    addMemberToAlbum,
    fetchMembers,
    removeMemberFromAlbum,
    removeImageFromAlbum,
    removeAlbum,
  }
}
export default useAlbums
