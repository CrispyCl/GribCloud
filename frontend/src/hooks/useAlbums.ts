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
import { deleteObject, ref, uploadString } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useAlbums = (path?: string[]) => {
  const [albumLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const albums = useSelector((state: RootState) => state.albums.albums)
  const publicAlbums = useSelector(
    (state: RootState) => state.publicAlbums.albums,
  )

  // fetching albums
  const fetchAlbums = async () => {
    try {
      dispatch(fetchAlbumsStart())
      const res = await api.get('/api/v1/albums/my/')
      dispatch(fetchAlbumsSuccess(res.data))
      return res
    } catch (err: any) {
      console.log(err)
      dispatch(fetchAlbumsFailure(err.toString()))
    }
  }

  const fetchPublicAlbums = async () => {
    try {
      dispatch(fetchPublicAlbumsStart())
      const res = await api.get('/api/v1/albums/')
      dispatch(fetchPublicAlbumsSuccess(res.data))
      return res
    } catch (err: any) {
      console.log(err)
      dispatch(fetchPublicAlbumsFailure(err.toString()))
    }
  }

  // Available albums
  const fetchUserAlbums = async () => {
    try {
      dispatch(fetchAlbumsStart())
      const res = await api.get(`api/v1/albums/available/`)
      dispatch(fetchAlbumsSuccess(res.data))
      return res
    } catch (err: any) {
      console.log(err)
      dispatch(fetchAlbumsFailure(err.toString()))
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
      await api.patch(`/api/v1/albums/${albumId}/`, {
        title: title,
        is_public: is_public,
      })
      if (is_public) {
        await fetchPublicAlbums()
      } else {
        await fetchAlbums()
      }
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

  // Create album
  const createAlbum = async (
    albumName: string,
    currentUser: AccountResponse,
    _public?: boolean,
  ) => {
    try {
      setLoading(true)
      const res = await api.post('/api/v1/albums/my/', {
        title: albumName,
        is_public: _public,
      })
      const storageRef = ref(
        imgStorage,
        `albums/${currentUser.id}/${albumName}/.folder`,
      )
      await uploadString(storageRef, JSON.stringify({ isFolder: true }))
      if (_public) await fetchPublicAlbums()
      else await fetchAlbums()
    } catch (error) {
      console.error('Ошибка при создании альбома:', (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // fetch users in album
  const fetchUsersInAlbum = async (albumId: number) => {
    try {
      setLoading(true)
      const res = await api.get(`/api/v1/albums/${albumId}/`)
      const users = await Promise.all(
        res.data.memberships.map(async (member: any) => {
          const response = await api.get(`/api/v1/user/${member.member}/`)
          return response.data
        }),
      )
      return users
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Add member to album
  const addMemberToAlbum = async (userId: number, is_redactor: boolean) => {
    try {
      setLoading(true)
      await api.post(`/api/v1/albums/${path && path[2]}/members/${userId}/`, {
        is_redactor: is_redactor,
      })
    } catch (error) {
      console.error(
        'Ошибка при добавлении участника в альбом:',
        (error as Error).message,
      )
    } finally {
      setLoading(false)
    }
  }

  // Remove member from album
  const removeMemberFromAlbum = async (userId: number) => {
    try {
      setLoading(true)
      await api.delete(`/api/v1/albums/${path && path[2]}/members/${userId}/`)
    } catch (error) {
      console.error(
        'Ошибка при удалении участника из альбома:',
        (error as Error).message,
      )
    } finally {
      setLoading(false)
    }
  }

  // Remove image from album
  const removeImageFromAlbum = async (
    album: AlbumResponse,
    image: number,
    path: string,
  ) => {
    try {
      setLoading(true)
      await api.delete(`/api/v1/albums/${album.id}/files/${image}/`)
      await deleteObject(ref(imgStorage, path))
      if (album.is_public) await fetchPublicAlbums()
      else await fetchAlbums()
    } catch (error) {
      console.error(
        'Ошибка при удалении изображения из альбома:',
        (error as Error).message,
      )
    } finally {
      setLoading(false)
    }
  }

  // Remove album
  const removeAlbum = async (album: AlbumResponse) => {
    try {
      setLoading(true)
      await Promise.all(
        album.files.map(async file => {
          await api.delete(`/api/v1/files/${file.id}/`)
        }),
      )
      await api.delete(`/api/v1/albums/${album.id}/`)
      await deleteObject(
        ref(imgStorage, `albums/${currentUser?.id}/${album.title}/.folder`),
      )
      if (album.is_public) await fetchPublicAlbums()
      else await fetchAlbums()
    } catch (error) {
      console.error('Ошибка при удалении альбома:', (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchAlbums(), fetchPublicAlbums()])
      } catch (error) {
        console.error('Ошибка при загрузке альбомов:', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  return {
    albumLoading,
    albums,
    publicAlbums,
    createAlbum,
    editAlbum,
    fetchUsersInAlbum,
    addMemberToAlbum,
    removeMemberFromAlbum,
    removeImageFromAlbum,
    removeAlbum,
    fetchUserAlbums,
    fetchAlbums,
    fetchPublicAlbums,
  }
}

export default useAlbums
