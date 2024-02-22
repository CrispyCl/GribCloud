import Body from '@components/Body/Body'
import { useAppSelector } from '@store/store'
import { FunctionComponent } from 'react'

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  const { user: currentUser } = useAppSelector(state => state.auth)
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Settings Page</h1>
      {/* <h1 className='text-5xl font-bold'>User: {currentUser.username}</h1>
      <h1 className='text-5xl font-bold'>Email: {currentUser.email}</h1> */}
    </Body>
  )
}

export default Settings
