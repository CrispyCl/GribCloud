import { ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Group, Text, rem } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'

export const DropZone = () => {
  return (
    <>
      <Dropzone.FullScreen
        active={true}
        accept={IMAGE_MIME_TYPE}
        onDrop={files => {
          console.log(files)
        }}
      >
        <Group
          justify='center'
          gap='xl'
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <ArrowUpIcon
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-blue-6)',
              }}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XMarkIcon
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
            />
          </Dropzone.Reject>
          <div>
            <Text size='xl' inline>
              Drag images here
            </Text>
            <Text size='sm' c='dimmed' inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone.FullScreen>
    </>
  )
}
