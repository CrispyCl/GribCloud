import Body from '@components/Body/Body'
import { RootState } from '@store/store'
import { FunctionComponent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  const account = useSelector((state: RootState) => state.auth.account)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // @ts-ignores
  const userId = account?.id
  console.log(account)
  // const user = useSWR<UserResponse>(`api/v1/user/${userId}/`, fetcher)

  return (
    <Body>
      <h1 className='text-5xl font-bold'>Settings Page</h1>
      {/* <h1 className='text-5xl font-bold'>User: {user.data?.username}</h1> */}
    </Body>
  )
}

export default Settings
