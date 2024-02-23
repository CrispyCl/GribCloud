import {
  Avatar,
  Button,
  Group,
  Menu,
  Modal,
  PasswordInput,
  SimpleGrid,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import authSlice from '@store/slices/auth'
import { RootState, useAppDispatch } from '@store/store'
import { EditAccountResponse } from '@store/types'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const UserModalButton = () => {
  const user = useSelector((state: RootState) => state.auth.account)
  const token = useSelector((state: RootState) => state.auth.token)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 50em)')

  const form = useForm<EditAccountResponse>({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      passwordConfirm: '',
      oldPassword: '',
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  })

  const closeModal = () => {
    setTimeout(() => {
      form.values.username = user?.username || ''
      form.values.email = user?.email || ''
      form.values.password = ''
      form.values.passwordConfirm = ''
      form.values.oldPassword = ''
    }, 100)
    close()
  }

  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout())
    navigate('/singin')
  }
  const handleUpdate = (username: string, email: string, password: string) => {
    axios
      .put(
        `/api/v1/user/${user?.id}/`,
        {
          username,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        dispatch(authSlice.actions.setAccount(res.data))
        closeModal()
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
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
          <Menu.Item onClick={open}>Settings</Menu.Item>
          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color='red' onClick={handleLogout}>
            Выйти
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={opened}
        onClose={closeModal}
        title='Настройки'
        centered
        fullScreen={isMobile}
      >
        <div className='flex flex-col gap-2'>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              value={form.values.username}
              onChange={event =>
                form.setFieldValue('username', event.currentTarget.value)
              }
              error={form.errors.username && 'Такое имя уже занято'}
              label='Ваше имя'
              placeholder={user?.username}
            />
            <TextInput
              value={form.values.email}
              onChange={event =>
                form.setFieldValue('email', event.currentTarget.value)
              }
              error={form.errors.email && 'Такая почта уже занята'}
              label='Ваша почта'
              placeholder={user?.email}
            />
          </SimpleGrid>

          {/* <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <PasswordInput
              type='password'
              value={form.values.password}
              onChange={event =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={
                (form.errors.password &&
                  'Пароль должен содержать не менее 6 символов') ||
                (form.values.password !== form.values.passwordConfirm &&
                  'Пароли не совпадают')
              }
              label='Новый пароль'
              placeholder='Новый пароль'
            />
            <PasswordInput
              value={form.values.passwordConfirm}
              onChange={event =>
                form.setFieldValue('passwordConfirm', event.currentTarget.value)
              }
              error={
                (form.errors.password &&
                  'Пароль должен содержать не менее 6 символов') ||
                (form.values.password !== form.values.passwordConfirm &&
                  'Пароли не совпадают')
              }
              label='Повторите новый пароль'
              placeholder='Новый пароль'
            />
          </SimpleGrid> */}
          <PasswordInput
            value={form.values.oldPassword}
            onChange={event =>
              form.setFieldValue('oldPassword', event.currentTarget.value)
            }
            error={
              form.errors.oldPassword &&
              'Пароль должен содержать не менее 6 символов'
            }
            label='Старый пароль'
            placeholder='Старый пароль'
          />
          <Group justify='flex-end' mt='md'>
            <Button
              onClick={() =>
                handleUpdate(
                  form.values.username,
                  form.values.email,
                  form.values.oldPassword,
                )
              }
              className='border-blue-500 text-blue-500'
            >
              Изменить данные
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  )
}
