import useAlbums from '@/hooks/useAlbums'
import { AlbumResponse, UserResponse } from '@/redux/types'
import api from '@/utils/axios'
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
import { FunctionComponent, useEffect, useState } from 'react'

interface Members {
  album: AlbumResponse
}

const MembersList: FunctionComponent<Members> = ({ album }) => {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [avatar, SetAvatar] = useState<string>('')
  const { removeMemberFromAlbum } = useAlbums()

  useEffect(() => {
    album.memberships.map(member => {
      api.get(`/api/v1/user/${member.member}/`).then(res => {
        setUsers((users: UserResponse[]) => [...users, res.data])
      })
    })
  }, [album.memberships])
    return (
      
    )
  })

  return (
    <Table verticalSpacing='md'>
      <Table.Tbody>
        <Table.Tr key={index}>
        <Table.Td>
          <Group gap='sm'>
            <Avatar size={40} src={avatar} radius={40} />
            <div>
              <Text fz='sm' fw={500}>
                {user.username}
              </Text>
              <Text c='dimmed' fz='xs'>
                {user.email}
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
                  onClick={() => {
                    removeMemberFromAlbum(user.id)
                  }}
                >
                  Удалить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
      </Table.Tbody>
    </Table>
  )
}
export default MembersList
