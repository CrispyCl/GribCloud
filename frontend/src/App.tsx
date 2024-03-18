import '@mantine/dropzone/styles.css'
import Albums from '@pages/Albums'
import GroupAlbums from '@pages/GroupAlbums'
import Home from '@pages/Home'
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import useAlbums from './hooks/useAlbums'
import Album from './pages/Album'
import GroupAlbum from './pages/GroupAlbum'
import NotFound from './pages/NotFound'
import SingIn from './pages/SingIn'
import SingUp from './pages/SingUp'
import UserProfile from './pages/UserProfile'
import { UserResponse } from './redux/types'
import api from './utils/axios'
function App() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [userLoading, setUserLoading] = useState<boolean>(false)
  const { albums, publicAlbums } = useAlbums()
  const fetchUsers = async () => {
    setUserLoading(true)
    await api.get('/api/v1/user/').then(res => {
      setUsers(res.data)
      setTimeout(() => {
        setUserLoading(false)
      }, 500)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <Routes>
      <Route path='/all' element={<Home />} />
      <Route path='/groupalbums' element={<GroupAlbums />} />
      <Route path='/albums' element={<Albums />} />
      <Route
        path='/singin'
        element={<SingIn loading={loading} setLoading={setLoading} />}
      />
      <Route
        path='/singup'
        element={<SingUp loading={loading} setLoading={setLoading} />}
      />
      {users.map((user, i) => {
        return (
          <Route
            key={i}
            path={`/user/${user.id}`}
            element={<UserProfile userLoading={userLoading} user={user} />}
          />
        )
      })}
      {Array.isArray(albums) &&
        albums.map((album, index) => {
          return (
            <Route
              key={index}
              path={`/album/${album.id}`}
              element={<Album currentAlbum={album} />}
            />
          )
        })}
      {Array.isArray(publicAlbums) &&
        publicAlbums.map((publicAlbum, index) => {
          return (
            <Route
              key={index}
              path={`/album/${publicAlbum.id}`}
              element={<GroupAlbum currentPublicAlbum={publicAlbum} />}
            />
          )
        })}

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
