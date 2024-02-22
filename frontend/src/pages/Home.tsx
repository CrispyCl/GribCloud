import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Home Page</h1>
    </Body>
  )
}

export default Home
