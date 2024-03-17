import { useAvatar } from '@/hooks/useAvatar'
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { actions } from '@store/slices/auth'
import { RootState, useAppDispatch } from '@store/store'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export const UserButton = () => {
  const user = useSelector((state: RootState) => state.auth.account)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { avatar } = useAvatar(undefined)

  const handleLogout = () => {
    dispatch(actions.setLogout())
    navigate('/singin')
  }

  return (
    <>
      <Menu shadow='sm' width={200}>
        <Menu.Target>
          <UnstyledButton>
            <Group>
              <Avatar src={avatar} variant='transparent' />
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
          <Menu.Item>
            <Link to={`/user/${user?.id}/`}>Профиль</Link>
          </Menu.Item>
          <Menu.Divider />

          <Menu.Label>Осторожно</Menu.Label>
          <Menu.Item color='red' onClick={handleLogout}>
            Выйти
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}
