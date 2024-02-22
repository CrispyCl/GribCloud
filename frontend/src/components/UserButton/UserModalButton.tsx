import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { Link } from 'react-router-dom'

export const UserModalButton = () => {
  return (
    <Menu shadow='sm' width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar variant='transparent' />
            <div style={{ flex: 1 }}>
              <Text size='sm' fw={500}>
                Max Bakurin
              </Text>

              <Text c='dimmed' size='xs'>
                max.bakurin@gmail.com
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
        <Link to='/logout'>
          <Menu.Item color='red'>Выйти</Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  )
}
