import { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SingUpProps {}

const SingUp: FunctionComponent<SingUpProps> = () => {
  const navigate = useNavigate()

  return (
    <>
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
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Почта
                  </label>
                  <div className='mt-2'>
                    <input
                      id='email'
                      type='email'
                      autoComplete='email'
                      required
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Пароль
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      id='password'
                      type='password'
                      autoComplete='current-password'
                      required
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password-confirm'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Повторите пароль
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      id='password-confirm'
                      type='password'
                      autoComplete='current-password'
                      required
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                  >
                    Зарегистрироваться
                  </button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm leading-5 text-gray-900'
                    >
                      Запомнить меня
                    </label>
                  </div>
                </div>
                <div className='mt-6'>
                  <p className='text-sm leading-5 text-gray-500'>
                    Есть аккаунт?{' '}
                    <button
                      onClick={() => navigate('/singin')}
                      className='pointer font-semibold text-blue-500 hover:text-blue-600'
                    >
                      Войти
                    </button>
                  </p>
                </div>
              </div>
              <div>
                <p className='mt-10 text-center text-sm leading-5 text-gray-500'>
                  © 2024. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SingUp
