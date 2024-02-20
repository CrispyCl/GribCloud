import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  return (
    <Body>
      <h1 className='text-5xl font-bold'>Settings Page</h1>
    </Body>
  )
}

export default Settings
