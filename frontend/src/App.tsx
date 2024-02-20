import '@mantine/dropzone/styles.css'
import Albums from '@pages/Albums'
import Archive from '@pages/Archive'
import Favorites from '@pages/Favorites'
import GroupAlbums from '@pages/GroupAlbums'
import Home from '@pages/Home'
import NotFound from '@pages/NotFound'
import Settings from '@pages/Settings'
import Trash from '@pages/Trash'
import { Route, Routes } from 'react-router-dom'

function App() {
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
}

export default App
