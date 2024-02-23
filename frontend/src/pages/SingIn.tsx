import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import authSlice from '@store/slices/auth'
import { useAppDispatch } from '@store/store'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IFormSingIn {
  username: string
  password: string
}

const SingIn = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const dispatch = useAppDispatch()

  const form = useForm<IFormSingIn>({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      password: (val: string) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  })
  const handleLogin = (username: string, password: string) => {
    axios
      .post('api/v1/token/', { username, password })
      .then(res => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          }),
        )
        axios
          .get('/api/v1/user/my/', {
            headers: {
              Authorization: `Bearer ${res.data.access}`,
            },
          })
          .then(res => {
            dispatch(authSlice.actions.setAccount(res.data))
            setLoading(false)
            navigate('/')
          })
          .catch(err => {
            setMessage(err.response.data.detail.toString())
          })
      })
      .catch(err => {
        setMessage(err.response.data.detail.toString())
      })
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center bg-slate-50 sm:items-center sm:px-6 sm:py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Вход
        </h2>
      </div>

      <div className=' sm:w-full sm:max-w-md sm:space-y-8'>
        <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
          <div className='my-8 max-sm:mx-5 sm:mx-auto sm:w-full sm:max-w-sm'>
            <div className='space-y-6'>
              <form
                onSubmit={form.onSubmit(() =>
                  handleLogin(form.values.username, form.values.password),
                )}
              >
                <Stack>
                  <TextInput
                    required
                    label='Почта'
                    placeholder='hello@gribcloud.dev'
                    value={form.values.username}
                    onChange={event =>
                      form.setFieldValue('username', event.currentTarget.value)
                    }
                    error={form.errors.username && 'Неправильная почта'}
                    radius='md'
                  />

                  <PasswordInput
                    required
                    label='Пароль'
                    placeholder='Ваш пароль'
                    value={form.values.password}
                    onChange={event =>
                      form.setFieldValue('password', event.currentTarget.value)
                    }
                    error={form.errors.password && 'Неправильный пароль'}
                    radius='md'
                  />
                </Stack>
                <div className='text-danger my-2 text-center' hidden={false}>
                  {message}
                </div>

                <Group justify='space-between' mt='xl'>
                  <Button
                    disabled={loading}
                    type='submit'
                    className='flex w-full items-center justify-center rounded-md bg-blue-500 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                    radius='xl'
                  >
                    Войти
                  </Button>
                  <Anchor
                    component='button'
                    type='button'
                    c='dimmed'
                    onClick={() => navigate('/singup')}
                    size='xs'
                  >
                    Ещё нет аккаунта? Зарегистрируйтесь
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

export default SingIn
