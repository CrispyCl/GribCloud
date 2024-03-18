import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Table,
  Text,
  rem,
} from '@mantine/core'

const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',

    email: 'rob_wolf@gmail.com',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',

    email: 'jj@breaker.com',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',

    email: 'henry@silkeater.io',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',

    email: 'bhorsefighter@gmail.com',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',

    email: 'jeremy@foot.dev',
  },
]

const MembersList = () => {
  const rows = data.map(item => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap='sm'>
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text fz='sm' fw={500}>
              {item.name}
            </Text>
            <Text c='dimmed' fz='xs'>
              {item.email}
            </Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify='flex-end'>
          <Menu
            transitionProps={{ transition: 'pop' }}
            withArrow
            position='bottom-end'
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <EllipsisHorizontalIcon
                  style={{ width: rem(16), height: rem(16) }}
                />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <TrashIcon style={{ width: rem(16), height: rem(16) }} />
                }
                color='red'
              >
                Удалить
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table verticalSpacing='md'>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
export default MembersList
