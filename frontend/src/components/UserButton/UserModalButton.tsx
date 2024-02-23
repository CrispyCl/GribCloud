import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import authSlice from '@store/slices/auth'
import { RootState, useAppDispatch } from '@store/store'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export const UserModalButton = () => {
  const user = useSelector((state: RootState) => state.auth.account)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout())
    navigate('/singin')
  }
  return (
    <Menu shadow='sm' width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar src={user?.img} variant='transparent' />
            <div style={{ flex: 1 }}>
              <Text size='sm' fw={500}>
                {user?.username}
              </Text>

              <Text c='dimmed' size='xs'>
                {user?.email}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Link to='/settings'>
          <Menu.Item>Settings</Menu.Item>
        </Link>
        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color='red' onClick={handleLogout}>
          Выйти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
