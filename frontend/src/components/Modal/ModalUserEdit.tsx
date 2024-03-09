import { useAvatar } from '@/hooks/useAvatar'
import { actions } from '@/redux/slices/auth'
import { RootState, useAppDispatch } from '@/redux/store'
import { EditAccountResponse } from '@/redux/types'
import api from '@/utils/axios'
import {
  Avatar,
  Button,
  FileButton,
  Group,
  Modal,
  PasswordInput,
  SimpleGrid,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useSelector } from 'react-redux'

export default function ModalUserEdit() {
  const user = useSelector((state: RootState) => state.auth.account)
  const dispatch = useAppDispatch()
  const [opened, { open, close }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { avatar, setFile } = useAvatar()

  const initialValues = {
    username: user?.username || '',
    email: user?.email || '',
    newPassword: '',
    newPasswordConfirm: '',
    oldPassword: '',
  }

  const form = useForm<EditAccountResponse>({
    initialValues: initialValues,

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      newPassword: (val: string) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  })

  const closeModal = () => {
    close()
    setTimeout(() => {
      form.reset()
    }, 1000)
    form.reset()
  }

  const handleUpdate = (
    username: string,
    email: string,
    password: string,
    new_password: string,
    new_password_confirm: string,
  ) => {
    if (new_password === '' && new_password_confirm === '') {
      api
        .put(`/api/v1/user/${user?.id}/`, { username, email, password })
        .then(res => {
          dispatch(actions.setAccount(res.data))
          closeModal()
        })
        .catch(err => console.log(err))
    } else if (
      new_password !== '' &&
      new_password === new_password_confirm &&
      email === user?.email &&
      username === user?.username
    ) {
      api
        .post('/api/v1/user/change_password/', {
          password,
          new_password,
          new_password_confirm,
        })
        .then(() => {
          dispatch(
            actions.setAuthTokens({
              token: localStorage.getItem('token'),
              refreshToken: localStorage.getItem('refreshToken'),
            }),
          )
          closeModal()
        })
        .catch(err => console.log(err))
    } else {
      const old_password = password
      api
        .put(`/api/v1/user/${user?.id}/`, { username, email, password })
        .then(res => {
          dispatch(actions.setAccount(res.data))
          dispatch(
            actions.setAuthTokens({
              token: localStorage.getItem('token'),
              refreshToken: localStorage.getItem('refreshToken'),
            }),
          )
          return api.post('/api/v1/user/change_password/', {
            old_password,
            new_password,
            new_password_confirm,
          })
        })
        .then(() => {
          dispatch(
            actions.setAuthTokens({
              token: localStorage.getItem('token'),
              refreshToken: localStorage.getItem('refreshToken'),
            }),
          )
          closeModal()
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeModal}
        title='Настройки'
        centered
        fullScreen={isMobile}
        size={'xl'}
      >
        <form
          onSubmit={() =>
            handleUpdate(
              form.values.username,
              form.values.email,
              form.values.oldPassword,
              form.values.newPassword,
              form.values.newPasswordConfirm,
            )
          }
          className='flex flex-col items-center justify-center gap-5 md:flex-row md:items-start md:justify-between'
        >
          <FileButton onChange={setFile}>
            {props => (
              <Avatar
                {...props}
                src={avatar}
                variant='transparent'
                className='h-64 w-64 cursor-pointer'
              />
            )}
          </FileButton>
          <div className='flex h-2/3 w-2/3 flex-col gap-2'>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                value={form.values.username}
                onChange={event =>
                  form.setFieldValue('username', event.currentTarget.value)
                }
                error={form.errors.username && 'Такое имя уже занято'}
                label='Ваш логин'
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

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <PasswordInput
                type='password'
                value={form.values.newPassword}
                onChange={event =>
                  form.setFieldValue('newPassword', event.currentTarget.value)
                }
                error={
                  (form.errors.newPassword &&
                    'Пароль должен содержать не менее 6 символов') ||
                  (form.values.newPassword !== form.values.newPasswordConfirm &&
                    'Пароли не совпадают')
                }
                label='Новый пароль'
                placeholder='Новый пароль'
              />
              <PasswordInput
                value={form.values.newPasswordConfirm}
                onChange={event =>
                  form.setFieldValue(
                    'newPasswordConfirm',
                    event.currentTarget.value,
                  )
                }
                error={
                  (form.errors.newPassword &&
                    'Пароль должен содержать не менее 6 символов') ||
                  (form.values.newPassword !== form.values.newPasswordConfirm &&
                    'Пароли не совпадают')
                }
                label='Повторите новый пароль'
                placeholder='Новый пароль'
              />
            </SimpleGrid>
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
              <Button type='submit' className='border-blue-500 text-blue-500'>
                Изменить данные
              </Button>
            </Group>
          </div>
        </form>
      </Modal>
      <Button
        onClick={open}
        variant='outline'
        className='my-5 border px-5 py-2 text-sm font-semibold'
      >
        Изменить данные
      </Button>
    </>
  )
}
