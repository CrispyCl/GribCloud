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
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  const auth = useSelector((state: RootState) => state.auth)

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
