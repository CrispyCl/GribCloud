import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Body>
      <h1 className='text-5xl font-bold'>Settings Page</h1>
    </Body>
  )
}

export default Settings
