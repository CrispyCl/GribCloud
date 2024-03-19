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
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const albums = useSelector((state: RootState) => state.albums.albums)
  const publicAlbums = useSelector(
    (state: RootState) => state.publicAlbums.albums,
  )
  // fetching albums
  const fetchAlbums = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/v1/albums/my/')
      dispatch(fetchAlbumsSuccess(res.data))
      setLoading(false)
    } catch (err: any) {
      console.log(err)
      dispatch(fetchAlbumsFailure(err.toString()))
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const fetchPublicAlbums = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/v1/albums/')
      dispatch(fetchPublicAlbumsSuccess(res.data))
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err: any) {
      console.log(err)
      dispatch(fetchPublicAlbumsFailure(err.toString()))
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // user albums
  const fetchUserAlbums = async (userId: number) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/albums/${userId}/`)
      dispatch(fetchAlbumsSuccess(res.data))
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err: any) {
      console.log(err)
      dispatch(fetchAlbumsFailure(err.toString()))
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // edit album
  const editAlbum = async (
    albumId: number,
    title: string,
    is_public: boolean,
  ) => {
    try {
      setLoading(true)
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
            setTimeout(() => {
              setLoading(false)
            }, 500)
          } else {
            dispatch(fetchAlbumsSuccess(res.data))
            fetchAlbums()
            setTimeout(() => {
              setLoading(false)
            }, 500)
          }
        })
        .catch(err => {
          console.log(err)
          if (is_public) dispatch(fetchPublicAlbumsFailure(err.toString()))
          else dispatch(fetchAlbumsFailure(err.toString()))
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    } catch (error) {
      console.error(
        'Ошибка при редактировании альбома:',
        (error as Error).message,
      )
      if (is_public)
        dispatch(fetchPublicAlbumsFailure((error as Error).message))
      else dispatch(fetchAlbumsFailure((error as Error).message))
      setTimeout(() => {
        setLoading(false)
      }, 500)
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
          if (_public) fetchPublicAlbums()
          else fetchAlbums()
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
        .catch(err => {
          console.log('error creating album', err)
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
    } catch (error) {
      console.error('Ошибка при создании альбома:', (error as Error).message)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // fetch users in album
  const fetchUsersInAlbum = async (albumId: number) => {
    setLoading(true)
    try {
      const res = await api.get(`/api/v1/albums/${albumId}/`)
      const users = await Promise.all(
        res.data.memberships.map(async (member: any) => {
          const response = await api.get(`/api/v1/user/${member.member}/`)
          return response.data
        }),
      )
      setTimeout(() => {
        setLoading(false)
      }, 500)
      return users
    } catch (err: any) {
      console.log(err)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // Add member to album
  const addMemberToAlbum = async (userId: number, is_redactor: boolean) => {
    setLoading(true)
    return api
      .post(`/api/v1/albums/${path && path[2]}/members/${userId}/`, {
        is_redactor: is_redactor,
      })
      .then(res => {
        console.log('added member to album', res.data)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
      .catch(err => {
        console.log('error adding member to album', err)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }

  // Remove member from album
  const removeMemberFromAlbum = async (userId: number) => {
    setLoading(true)
    return api
      .delete(`/api/v1/albums/${path && path[2]}/members/${userId}/`)
      .then(res => {
        console.log('removed member from album', res.data)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
      .catch(err => {
        console.log('error removing member from album', err)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }

  // Remove image from album
  const removeImageFromAlbum = async (
    album: AlbumResponse,
    image: number,
    path: string,
  ) => {
    try {
      setLoading(true)
      const res = await api.delete(`/api/v1/albums/${album.id}/files/${image}/`)
      deleteObject(ref(imgStorage, path))
      if (album.is_public) {
        fetchPublicAlbums()
      } else {
        fetchAlbums()
      }
      setTimeout(() => {
        setLoading(false)
      }, 500)
      return res.data
    } catch (error) {
      console.error(
        'Ошибка при удалении изображения из альбома:',
        (error as Error).message,
      )
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // Remove album
  const removeAlbum = async (album: AlbumResponse) => {
    try {
      setLoading(true)
      album.files.forEach(async file => {
        await api.delete(`/api/v1/files/${file.id}/`)
      })
      await api.delete(`/api/v1/albums/${album.id}/`)
      await deleteObject(
        ref(imgStorage, `albums/${currentUser?.id}/${album.title}/.folder`),
      ).then(() => {
        if (album.is_public) {
          fetchPublicAlbums()
        } else {
          fetchAlbums()
        }
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
    } catch (error) {
      console.error('Ошибка при удалении альбома:', (error as Error).message)
      setTimeout(() => {
        setLoading(false)
      }, 500)
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
    fetchUsersInAlbum,
    addMemberToAlbum,
    removeMemberFromAlbum,
    removeImageFromAlbum,
    removeAlbum,
  }
}
export default useAlbums
