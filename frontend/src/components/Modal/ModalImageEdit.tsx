import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { LoadingOverlay, Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Compressor from 'compressorjs'
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage'
import React, { FunctionComponent, useState } from 'react'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'
import { useSelector } from 'react-redux'
import Translation_RU from '../../constants/Translation_RU'

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
  const [loading, setLoading] = useState(false)

  const compressImage = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.4,
        success(result) {
          const previewBlob = new Blob([result], { type: 'image/jpeg' })
          const previewStorageRef = ref(
            imgStorage,
            `previews/${user?.id}/${file.name}`,
          )
          const previewUploadTask = uploadBytesResumable(
            previewStorageRef,
            previewBlob,
          )
          previewUploadTask
            .then(async () => {
              const previewUrl = await getDownloadURL(previewStorageRef)
              resolve(previewUrl)
            })
            .catch(reject)
        },
      })
    })
  }

  const onDownload = async (editedImageObject: any) => {
    setLoading(true)
    const link = document.createElement('a')
    link.download = name
    link.href = editedImageObject.imageBase64
    await uploadString(
      ref(imgStorage, `images/${user?.id}/${name}/`),
      link.href,
      'data_url',
    )

    // Преобразование base64-encoded строки в Blob
    const response = await fetch(editedImageObject.imageBase64)
    const blob = await response.blob()

    // Создание объекта File из Blob
    const file = new File([blob], name, { type: blob.type })

    const previewUrl = await compressImage(file)
    previewUrl && setKey(prev => prev + 1)
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
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
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
          onDownload(editedImageObject).then(() => {
            setLoading(false)
            close()
            window.location.reload()
          })
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
