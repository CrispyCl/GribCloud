import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { login } from '@store/slices/auth'
import { clearMessage } from '@store/slices/message'
import { useAppDispatch, useAppSelector } from '@store/store'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

interface IFormSingIn {
  email: string
  password: string
  name: string
  terms: boolean
}

const SingIn = () => {
  const form = useForm<IFormSingIn>({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  })

  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const { isLoggedIn } = useAppSelector(state => state.auth)
  const { message } = useAppSelector(state => state.message)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearMessage())
  }, [dispatch])

  const handleLogin = (formValue: any) => {
    const { username, password } = formValue
    setLoading(true)

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate('/settings')
        window.location.reload()
      })
      .catch(() => {
        setLoading(false)
      })
  }

  if (isLoggedIn) {
    return <Navigate to='/settings' />
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
              <form onSubmit={form.onSubmit(handleLogin)}>
                <Stack>
                  <TextInput
                    required
                    label='Почта'
                    placeholder='hello@gribcloud.dev'
                    value={form.values.email}
                    onChange={event =>
                      form.setFieldValue('email', event.currentTarget.value)
                    }
                    error={form.errors.email && 'Неправильная почта'}
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

                <Group justify='space-between' mt='xl'>
                  <Button
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
