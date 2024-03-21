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
import { FunctionComponent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IFormSingIn {
  username: string
  password: string
}

interface SingInProps {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SingIn: FunctionComponent<SingInProps> = ({ loading, setLoading }) => {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string>('')
  const dispatch = useAppDispatch()

  const form = useForm<IFormSingIn>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      password: value =>
        value.length < 6 ? 'Пароль должен содержать не менее 6 символов' : null,
    },
  })

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true)
      api
        .post('/api/v1/token/', { username, password })
        .then(res => {
          localStorage.setItem('token', res.data.access)
          localStorage.setItem('refreshToken', res.data.refresh)
          dispatch(
            actions.setAuthTokens({
              token: res.data.access,
              refreshToken: res.data.ref,
            }),
          )
        })
        .then(() => {
          api.get('/api/v1/user/my/').then(res => {
            dispatch(actions.setAccount(res.data))
            setLoading(false)
            navigate('/all')
          })
        })
        .catch(err => {
          if (err) {
            setMessage('Неправильный логин или пароль')
          }
          setLoading(false)
        })
    } catch (err) {
      setLoading(false)
      if (err) {
        setMessage('Неправильный логин или пароль')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center bg-slate-50 sm:items-center sm:px-6 sm:py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Вход
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
                  handleLogin(form.values.username, form.values.password),
                )}
              >
                <Stack>
                  <TextInput
                    required
                    label='Логин'
                    placeholder='gribСloud'
                    {...form.getInputProps('username')}
                    radius='md'
                  />

                  <PasswordInput
                    required
                    label='Пароль'
                    placeholder='Ваш пароль'
                    {...form.getInputProps('password')}
                    radius='md'
                  />
                </Stack>
                <div
                  className='text-danger mb-2 mt-4 text-center'
                  hidden={false}
                >
                  {message}
                </div>
                <Group justify='space-between '>
                  <Button
                    disabled={loading}
                    type='submit'
                    className='mt-2 flex w-full items-center justify-center rounded-md bg-blue-500 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
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
