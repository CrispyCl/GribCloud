import {
  Anchor,
  Button,
  Group,
  PaperProps,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'

const SingIn = (props: PaperProps) => {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: val =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  })

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
              <form onSubmit={form.onSubmit(() => {})}>
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
