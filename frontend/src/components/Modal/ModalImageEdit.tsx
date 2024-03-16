import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ref, uploadString } from 'firebase/storage'
import React, { FunctionComponent } from 'react'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'
import { useSelector } from 'react-redux'
import Translation_RU from './Translation_RU'

interface ModalImageEditProps {
  name: string
  opened: boolean
  url: string
  setKey: React.Dispatch<React.SetStateAction<number>>
  close: () => void
}

const ModalImageEdit: FunctionComponent<ModalImageEditProps> = ({
  opened,
  close,
  setKey,
  url,
  name,
}) => {
  const user = useSelector((state: RootState) => state.auth.account)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const onDownload = async (editedImageObject: any) => {
    const link = document.createElement('a')
    link.download = name
    link.href = editedImageObject.imageBase64
    await uploadString(
      ref(imgStorage, `images/${user?.id}/${name}/`),
      link.href,
      'data_url',
    )
      .then(() => {
        close()
      })
      .then(() => {
        setKey(k => k + 1)
      })
  }

  return (
    <Modal
      fullScreen={isMobile}
      size='80%'
      opened={opened}
      onClose={close}
      title={
        <div className=' text-xl font-semibold'>Редактирование изображения</div>
      }
    >
      <FilerobotImageEditor
        savingPixelRatio={4}
        previewPixelRatio={window.devicePixelRatio}
        source={url}
        theme={{
          typography: {
            fontFamily: 'inherit',
          },
        }}
        translations={Translation_RU}
        defaultSavedImageName={name}
        onSave={(editedImageObject, designState) => {
          onDownload(editedImageObject)
          console.log('saved', editedImageObject, designState)
        }}
        annotationsCommon={{
          fill: '#000',
        }}
        observePluginContainerSize={false}
        disableSaveIfNoChanges={true}
        Text={{ text: '' }}
        Rotate={{ angle: 90, componentType: 'slider' }}
        tabsIds={[TABS.ADJUST, TABS.FINETUNE, TABS.ANNOTATE]}
        defaultTabId={TABS.ADJUST}
        defaultToolId={TOOLS.CROP}
      />
    </Modal>
  )
}

export default ModalImageEdit
