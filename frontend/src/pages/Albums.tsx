import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface AlbumsProps {}

const Albums: FunctionComponent<AlbumsProps> = () => {
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Albums Page</h1>
    </Body>
  )
}

export default Albums
