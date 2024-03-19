import { BottomLinks, TopLinks } from '@/constants'
import { actions } from '@/redux/slices/auth'
import { useAppDispatch } from '@/redux/store'
import { AccountResponse } from '@/redux/types'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { Avatar, Button, CloseButton, Group, Text } from '@mantine/core'
import React, { Fragment, FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SideNavigationMobileProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentUser?: AccountResponse | null
  avatar?: string
}

const SideNavigationMobile: FunctionComponent<SideNavigationMobileProps> = ({
  open,
  setOpen,
  currentUser,
  avatar,
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(actions.setLogout())
    navigate('/singin')
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-40 lg:hidden' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 z-40 flex'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <Dialog.Panel className='relative flex w-full max-w-xs flex-col justify-between overflow-y-auto bg-white shadow-xl'>
              <div>
                <div className=' flex items-center justify-between px-4 py-4'>
                  {currentUser && (
                    <Group
                      className='w-2/3'
                      onClick={() => {
                        if (
                          window.location.pathname.split('/')[1] +
                            `/${currentUser?.id}` ===
                          `user/${currentUser?.id}`
                        ) {
                          setOpen(false)
                        } else {
                          navigate(`/user/${currentUser?.id}`)
                        }
                      }}
                    >
                      <Avatar src={avatar} variant='transparent' />
                      <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                          {currentUser?.username}
                        </Text>

                        <Text c='dimmed' size='xs'>
                          {currentUser?.email}
                        </Text>
                      </div>
                    </Group>
                  )}
                  {!currentUser && <span />}
                  <CloseButton onClick={() => setOpen(false)} />
                </div>
                {currentUser ? (
                  <>
                    <div className='space-y-6 border-t border-gray-200 px-4 py-4'>
                      {TopLinks.map((link, index) => {
                        return (
                          <div key={index} className='flow-root'>
                            <Button
                              onClick={() => {
                                if (
                                  link.route ===
                                  '/' + window.location.pathname.split('/')[1]
                                ) {
                                  setOpen(false)
                                } else {
                                  navigate(link.route)
                                }
                              }}
                              className='-m-2 block border-none p-2 font-medium text-gray-900'
                              leftSection={
                                <img
                                  src={link.icon}
                                  alt='folderIcon'
                                  className='h-5 w-5'
                                />
                              }
                              variant='default'
                              fullWidth
                              justify='space-between'
                              rightSection={<span />}
                            >
                              {link.name}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                    <div className='space-y-6 px-4 py-3'>
                      <Text className='text-gray-400'>Библиотека</Text>
                      {BottomLinks.map((link, index) => {
                        return (
                          <div key={index} className='flow-root'>
                            <Button
                              onClick={() => {
                                if (
                                  link.route ===
                                  '/' + window.location.pathname.split('/')[1]
                                ) {
                                  setOpen(false)
                                } else {
                                  navigate(link.route)
                                }
                              }}
                              className='-m-2 -mt-2 block border-none p-2  font-medium text-gray-900'
                              leftSection={
                                <img
                                  src={link.icon}
                                  alt='folderIcon'
                                  className='h-5 w-5'
                                />
                              }
                              fullWidth
                              variant='default'
                              justify='space-between'
                              rightSection={<span />}
                            >
                              {link.name}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className='space-y-6 border-t border-gray-200 px-4 py-4'>
                    <Button
                      onClick={() => {
                        if (
                          '/singin' ===
                          '/' + window.location.pathname.split('/')[1]
                        ) {
                          setOpen(false)
                        } else {
                          navigate('/singin')
                        }
                      }}
                      className='-m-2 -mt-2 block border-none p-2 font-medium text-gray-900'
                      variant='default'
                      fullWidth
                      justify='center'
                    >
                      Войти
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          '/singup' ===
                          '/' + window.location.pathname.split('/')[1]
                        ) {
                          setOpen(false)
                        } else {
                          navigate('/singup')
                        }
                      }}
                      className='-m-2 -mt-2 block border-none p-2 font-medium text-gray-900'
                      variant='default'
                      fullWidth
                      justify='center'
                    >
                      Зарегистрироваться
                    </Button>
                  </div>
                )}
              </div>
              <div className='border-t border-gray-200 p-4'>
                <Button
                  onClick={() => handleLogout()}
                  className='-m-2 -mt-2 block border-none p-2 pt-0 font-medium text-gray-900'
                  variant='default'
                  fullWidth
                  justify='space-between'
                  leftSection={
                    <ArrowLeftStartOnRectangleIcon className='h-5 w-5' />
                  }
                  rightSection={<span />}
                >
                  Выйти
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default SideNavigationMobile
