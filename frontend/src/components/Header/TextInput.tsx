import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { ActionIcon, TextInput, TextInputProps, rem } from '@mantine/core'
import { FunctionComponent } from 'react'

interface InputWithButtonProps extends TextInputProps {
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>
}
const InputWithButton: FunctionComponent<InputWithButtonProps> = ({
  setSearchValue,
}) => {
  return (
    <TextInput
      radius='xl'
      size='md'
      placeholder='Поиск...'
      rightSectionWidth={42}
      leftSection={
        <MagnifyingGlassIcon style={{ width: rem(18), height: rem(18) }} />
      }
      rightSection={
        <ActionIcon size={32} radius='xl' variant='default'>
          <ArrowRightIcon style={{ width: rem(18), height: rem(18) }} />
        </ActionIcon>
      }
      onInput={e => {
        if (setSearchValue) {
          setSearchValue(e.currentTarget.value)
        }
      }}
    />
  )
}

export default InputWithButton
