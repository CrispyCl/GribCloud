import { imgStorage } from '@/firebase/config'
import useAlbums from '@/hooks/useAlbums'
import { fetchAlbumsSuccess } from '@/redux/slices/albums'
import { fetchPublicAlbumsSuccess } from '@/redux/slices/publicAlbums'
import { RootState } from '@/redux/store'
import { AlbumResponse, UserResponse } from '@/redux/types'
import api from '@/utils/axios'
import { getDownloadURL, ref } from '@firebase/storage'
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  ActionIcon,
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Button,
  Checkbox,
  Group,
  Input,
  LoadingOverlay,
  Menu,
  Modal,
  Table,
  Text,
  TextInput,
  rem,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
interface ModalSettingAlbumProps {
  album: AlbumResponse
  loading: boolean
  openedAddMember: boolean
  openedSettings: boolean
  openAddMember: () => void
  closeAddMember: () => void
  closeSettings: () => void
  setKey: React.Dispatch<React.SetStateAction<number>>
}

const ModalSettingAlbum: FunctionComponent<ModalSettingAlbumProps> = ({
  album,
  openedAddMember,
  openedSettings,
  openAddMember,
  closeAddMember,
  closeSettings,
  setKey,
}) => {
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {
    loading,
    editAlbum,
    removeAlbum,
    addMemberToAlbum,
    removeMemberFromAlbum,
    fetchUsersInAlbum,
  } = useAlbums(window.location.pathname.split('/'))
  const [users, setUsers] = useState<UserResponse[]>([])
  const [membersName, setMembersName] = useState<string[]>([])
  const [avatars, setAvatars] = useState<Record<number, string>>({})
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [usersData, setUsersData] = useState<
    Record<string, { id: number; email: string; avatar: string }>
  >({})
  const [isRedactor, setIsRedactor] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const loadingAll = loadingState || loading
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      title: album?.title,
      is_public: album?.is_public,
    },
    validate: values => ({
      title: values.title?.length === 0 ? 'Обязательное поле' : null,
    }),
  })
  const handleSubmit = () => {
    setLoadingState(true)
    if (album) {
      if (!form.values.is_public) {
        // @ts-ignore
        fetchAlbumsSuccess((prev: AlbumResponse[]) => {
          return prev.map(item => {
            if (item.id === album.id && !item.is_public) {
              return { ...item, is_public: true }
            } else if (item.id === album.id && item.title !== album.title) {
              return { ...item, title: form.values.title as string }
            } else if (
              item.id === album.id &&
              !item.is_public &&
              item.title !== album.title
            ) {
              return {
                ...item,
                title: form.values.title as string,
                is_public: true,
              }
            }
            return item
          })
        })
      } else if (!form.values.is_public) {
        // @ts-ignore
        fetchPublicAlbumsSuccess((prev: AlbumResponse[]) => {
          return prev.map(item => {
            if (item.id === album.id && !item.is_public) {
              return { ...item, is_public: false }
            } else if (item.id === album.id && item.title !== album.title) {
              return { ...item, title: form.values.title as string }
            } else if (
              item.id === album.id &&
              !item.is_public &&
              item.title !== album.title
            ) {
              return {
                ...item,
                title: form.values.title as string,
                is_public: false,
              }
            }
            return item
          })
        })
      }
      editAlbum(
        album.id,
        form.values.title as string,
        form.values.is_public as boolean,
      )
      setKey(prev => prev + 1)
      setLoadingState(false)
    } else {
      setLoadingState(false)
    }
  }

  useEffect(() => {
    fetchUsersInAlbum(album?.id).then((res: any) => {
      setUsers(res)
      res.forEach((user: UserResponse) => {
        setMembersName(prev => [...prev, user.username])
      })
    })
  }, [album])

  useEffect(() => {
    const fetchAllUsers = async () => {
      await api.get('/api/v1/user/').then(res => {
        fetchAllUsersAvatar(res.data)
      })
    }

    const fetchAllUsersAvatar = (users: UserResponse[]) => {
      users?.forEach(user => {
        getDownloadURL(ref(imgStorage, `avatars/${user.id}`))
          .then(url => {
            setUsersData(prevUsersData => ({
              ...prevUsersData,
              [user.username]: { id: user.id, email: user.email, avatar: url },
            }))
          })
          .catch(() => {
            setUsersData(prevUsersData => ({
              ...prevUsersData,
              [user.username]: { id: user.id, email: user.email, avatar: '' },
            }))
          })
      })
    }

    fetchAllUsers()
  }, [])

  useEffect(() => {
    users?.forEach(user => {
      getDownloadURL(ref(imgStorage, `avatars/${user.id}`))
        .then(url => {
          setAvatars(prevAvatars => ({
            ...prevAvatars,
            [user.id]: url,
          }))
        })
        .catch(() => {
          setAvatars(prevAvatars => ({
            ...prevAvatars,
            [user.id]: '',
          }))
        })
    })
  }, [users])

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({
    option,
  }) => {
    if (
      !membersName.includes(option.value) &&
      option.value !== currentUser?.username
    ) {
      return (
        <Group gap='sm'>
          <Avatar src={usersData[option.value].avatar} size={36} radius='xl' />
          <div>
            <Text size='sm'>{option.value}</Text>
            <Text size='xs' opacity={0.5}>
              {usersData[option.value].email}
            </Text>
          </div>
        </Group>
      )
    } else {
      return null
    }
  }

  return (
    <Modal
      opened={openedSettings}
      onClose={closeSettings}
      title='Настройки альбома'
      centered
      fullScreen={isMobile}
      size={'xl'}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <div className='flex flex-col'>
        <div className='flex items-center justify-center gap-5'>
          <Group className='flex gap-5'>
            <Input.Wrapper w={'100%'} label='Название альбома' withAsterisk>
              <TextInput
                placeholder='Пример: Мои фото'
                value={form.values.title}
                onChange={event =>
                  form.setFieldValue('title', event.currentTarget.value)
                }
                error={form.errors.title}
              />
            </Input.Wrapper>
            <Checkbox
              label='Публичный'
              checked={form.values?.is_public}
              onChange={event =>
                form.setFieldValue('is_public', event.currentTarget.checked)
              }
            />
          </Group>
        </div>
        <div className='px-0 md:px-10'>
          <div className='mt-5 flex items-center justify-between'>
            <Text size='xl'>Участники</Text>
            <div>
              <Button
                variant='default'
                onClick={() => {
                  openAddMember()
                }}
              >
                Добавить
              </Button>
            </div>
          </div>
          {users?.map((user, index) => {
            return (
              <Table key={index} verticalSpacing='md'>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Group gap='sm'>
                        <Avatar size={40} src={avatars[user.id]} radius={40} />
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
                                <TrashIcon
                                  style={{ width: rem(16), height: rem(16) }}
                                />
                              }
                              color='red'
                              onClick={() => {
                                removeMemberFromAlbum(user.id)
                                  .then(() => fetchUsersInAlbum(album.id))
                                  .then(() => {
                                    setKey(prev => prev + 1)
                                  })
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
          })}
        </div>
        <div className='mt-5 flex justify-end'>
          <div className='flex gap-5'>
            <Button
              variant='subtle'
              color='red'
              onClick={openDelete}
              leftSection={<TrashIcon className='h-5 w-5' />}
            >
              Удалить альбом
            </Button>
            <Button
              className='border-blue-500 text-blue-500'
              onClick={handleSubmit}
            >
              Изменить данные
            </Button>
          </div>
        </div>
      </div>
      <Modal
        opened={openedAddMember}
        onClose={closeAddMember}
        title='Добавить участника'
        centered
        fullScreen={isMobile}
        size={'xl'}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <div className='mt-5'>
          <Autocomplete
            placeholder='Пример: gribGloud@gmail.com или grib'
            renderOption={renderAutocompleteOption}
            maxDropdownHeight={300}
            data={Object.keys(usersData).map(item => ({
              value: item,
              label: item,
            }))}
            w={'100%'}
            label='Почта или логин'
            withAsterisk
            comboboxProps={{
              transitionProps: { transition: 'pop', duration: 200 },
            }}
            onChange={value => setSelectedUser(value)}
          />
          <div className='mt-5'>
            <Checkbox
              label='Редактор'
              checked={isRedactor}
              onChange={event => setIsRedactor(event.currentTarget.checked)}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              variant='subtle'
              className='mt-5 border-blue-500 text-blue-500'
              onClick={() => {
                const userId = usersData[selectedUser]?.id // Получите user.id из usersData
                if (userId) {
                  addMemberToAlbum(userId, isRedactor)
                    .then(() => fetchUsersInAlbum(album.id))
                    .then(() => {
                      setKey(prev => prev + 1)
                    })
                  closeAddMember()
                }
              }}
            >
              Добавить
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title='Удалить альбом?'
        centered
        fullScreen={isMobile}
        size={'xl'}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Text size='xl'>
          Вы уверены, что хотите удалить альбом? Все фотографии будут удалены.
        </Text>
        <div className='mt-5 flex justify-end'>
          <div className='flex gap-5'>
            <Button
              variant='subtle'
              color='red'
              leftSection={<TrashIcon className='h-5 w-5' />}
              onClick={() => {
                removeAlbum(album)
                if (!loading) {
                  navigate('/albums')
                }
              }}
            >
              Удалить
            </Button>
            <Button
              className='border-blue-500 text-blue-500'
              onClick={closeDelete}
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  )
}

export default ModalSettingAlbum
