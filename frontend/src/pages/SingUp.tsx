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
import { iFormSingUp } from '@store/types'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SingUp = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const form = useForm<iFormSingUp>({
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  })

  const handleRegister = (
    username: string,
    email: string,
    password: string,
  ) => {
    axios
      .post('api/v1/user/', { username, email, password })
      .then(res => {
        dispatch(authSlice.actions.setAccount(res.data))
        setLoading(false)
        navigate('/')
      })
      .catch(err => {
        setMessage(err.response.data.detail.toString())
      })
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center bg-slate-50 sm:items-center sm:px-6 sm:py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Регистрация
        </h2>
      </div>

      <div className=' sm:w-full sm:max-w-md sm:space-y-8'>
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
                    label='Ваше имя'
                    placeholder='gribCloud'
                    value={form.values.username}
                    onChange={event =>
                      form.setFieldValue('username', event.currentTarget.value)
                    }
                    error={form.errors.username && 'Такое имя уже занято'}
                    radius='md'
                  />
                  <TextInput
                    required
                    label='Почта'
                    placeholder='gribCloud@gribCloud.dev'
                    value={form.values.email}
                    onChange={event =>
                      form.setFieldValue('email', event.currentTarget.value)
                    }
                    error={form.errors.email && 'Такая почта уже занята'}
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
                    error={
                      (form.errors.password &&
                        'Пароль должен содержать не менее 6 символов') ||
                      (form.values.password !== form.values.passwordConfirm &&
                        'Пароли не совпадают')
                    }
                    radius='md'
                  />
                  <PasswordInput
                    required
                    label='Повторите пароль'
                    placeholder='Повторите ваш пароль'
                    value={form.values.passwordConfirm}
                    onChange={event =>
                      form.setFieldValue(
                        'passwordConfirm',
                        event.currentTarget.value,
                      )
                    }
                    error={
                      (form.errors.passwordConfirm &&
                        'Пароль должен содержать не менее 6 символов') ||
                      (form.values.password !== form.values.passwordConfirm &&
                        'Пароли не совпадают')
                    }
                    radius='md'
                  />
                </Stack>
                <div className='text-danger my-2 text-center' hidden={false}>
                  {message}
                </div>
                <Group justify='space-between' mt='xl'>
                  <Button
                    type='submit'
                    className='flex w-full items-center justify-center rounded-md bg-blue-500 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
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
