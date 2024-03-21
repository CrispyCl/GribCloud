import api from '@/utils/axios'
import {
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { actions } from '@store/slices/auth'
import { useAppDispatch } from '@store/store'
import { iFormSingUp } from '@store/types'
import React, { FunctionComponent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SingUpProps {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SingUp: FunctionComponent<SingUpProps> = ({ loading, setLoading }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState<string>('')

  const form = useForm<iFormSingUp>({
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      email: (val: string) =>
        /^\S+@\S+$/.test(val) ? null : 'Такой почты не существует',
      password: (val: string) =>
        val.length < 6 ? 'Пароль должен содержать не менее 6 символов' : null,
      passwordConfirm: (val: string) => {
        if (val !== form.values.password) {
          return 'Пароли не совпадают'
        }
        return null
      },
    },
  })

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true)
      api
        .post('/api/v1/user/', { username, email, password })
        .then(res => {
          dispatch(actions.setAccount(res.data))
        })
        .then(() => {
          api.post('/api/v1/token/', { username, password }).then(res => {
            localStorage.setItem('token', res.data.access)
            localStorage.setItem('refreshToken', res.data.refresh)
            dispatch(
              actions.setAuthTokens({
                token: res.data.access,
                refreshToken: res.data.refresh,
              }),
            )
            setLoading(false)
            navigate('/all')
          })
        })
        .catch(err => {
          setMessage((err as Error).message)
          setLoading(false)
        })
    } catch (err) {
      setMessage((err as Error).message)
    }
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center bg-slate-50 sm:items-center sm:px-6 sm:py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Регистрация
        </h2>
      </div>

      <div className=' sm:w-full sm:max-w-md sm:space-y-8'>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
          <div className='my-8 max-sm:mx-5 sm:mx-auto sm:w-full sm:max-w-sm'>
            <div className='space-y-6'>
              <form
                onSubmit={form.onSubmit(() =>
                  handleRegister(
                    form.values.username,
                    form.values.email,
                    form.values.password,
                  ),
                )}
              >
                <Stack>
                  <TextInput
                    required
                    label='Логин'
                    placeholder='gribCloud'
                    {...form.getInputProps('username')}
                    radius='md'
                  />
                  <TextInput
                    required
                    label='Почта'
                    placeholder='gribCloud@gribCloud.dev'
                    {...form.getInputProps('email')}
                    radius='md'
                  />

                  <PasswordInput
                    required
                    label='Пароль'
                    placeholder='Ваш пароль'
                    value={form.values.password}
                    {...form.getInputProps('password')}
                    radius='md'
                  />
                  <PasswordInput
                    required
                    label='Повторите пароль'
                    placeholder='Повторите ваш пароль'
                    {...form.getInputProps('passwordConfirm')}
                    radius='md'
                  />
                </Stack>
                <div
                  className='text-danger mb-2 mt-4 text-center'
                  hidden={false}
                >
                  {message}
                </div>
                <Group justify='space-between' mt='xl'>
                  <Button
                    type='submit'
                    disabled={loading}
                    className='mt-2 flex w-full items-center justify-center rounded-md bg-blue-500 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                    radius='xl'
                  >
                    Зарегистрироваться
                  </Button>
                  <Anchor
                    component='button'
                    type='button'
                    c='dimmed'
                    onClick={() => navigate('/singin')}
                    size='xs'
                  >
                    Уже есть аккаунт? Войти
                  </Anchor>
                </Group>
              </form>
              <div>
                <p className='mt-10 text-center text-sm leading-5 text-gray-500'>
                  © 2024. GribCloud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingUp
