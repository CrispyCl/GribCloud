import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface FavoritesProps {}

const Favorites: FunctionComponent<FavoritesProps> = () => {
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Favorites Page</h1>
    </Body>
  )
}

export default Favorites
