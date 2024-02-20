import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface TrashProps {}

const Trash: FunctionComponent<TrashProps> = () => {
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Trash Page</h1>
    </Body>
  )
}

export default Trash
