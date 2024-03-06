import '@mantine/dropzone/styles.css'
import Albums from '@pages/Albums'
import Archive from '@pages/Archive'
import Favorites from '@pages/Favorites'
import GroupAlbums from '@pages/GroupAlbums'
import Home from '@pages/Home'
import NotFound from '@pages/NotFound'
import Settings from '@pages/Settings'
import SingIn from '@pages/SingIn'
import SingUp from '@pages/SingUp'
import Trash from '@pages/Trash'
import { RootState } from '@store/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import FolderPage from './components/Folder/Folder'
import useFolders from './hooks/useFolders'
import UserProfile from './pages/UserProfile'
import { UserResponse } from './redux/types'
import api from './utils/axios'

function App() {
  const auth = useSelector((state: RootState) => state.auth)
  const [users, setUsers] = useState<UserResponse[]>([])
  const { currentUserFolders, userFolders } = useFolders()

  const fetchUsers = async () => {
    await api.get('/api/v1/user/').then(res => {
      setUsers(res.data)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {}, [auth.account])

  if (auth.account) {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/groupalbums' element={<GroupAlbums />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/albums' element={<Albums />} />
        <Route path='/archive' element={<Archive />} />
        <Route path='/trash' element={<Trash />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='*' element={<NotFound />} />
        {users.map((user, i) => {
          return (
            <Route
              key={i}
              path={`/user/${user.id}`}
              element={<UserProfile user={user} />}
            />
          )
        })}
        {currentUserFolders.map((folder, index) => {
          return (
            <Route
              key={index}
              path={folder}
              element={<FolderPage folderName={folder} />}
            />
          )
        })}
      </Routes>
    )
  } else if (!auth.account) {
    return (
      <Routes>
        <Route path='/singin' element={<SingIn />} />
        <Route path='/singup' element={<SingUp />} />
        <Route path='*' element={<Navigate to='/singin' />} />
      </Routes>
    )
  }
}

export default App
