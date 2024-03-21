import React, { FunctionComponent, useEffect, useRef } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

interface Fancybox {
  children: React.ReactNode
  open: () => void
  openMap: () => void
  addTagOpen: () => void
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
  setLatitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  setLongitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  setAddTagId?: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Fancybox: FunctionComponent<Fancybox> = ({
  children,
  setUrl,
  setName,
  open,
  openMap,
  addTagOpen,
  setAddTagId,
  setLatitude,
  setLongitude,
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const delegate = '[data-fancybox]'
    const options = {
      Carousel: {
        infinite: false,
      },
      Toolbar: {
        items: {
          edit: {
            tpl: '<button data-fancybox-download data-fancybox-id id="javascript:;" href="javascript:;" class="f-button" type="button" title="Изменить"><svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path></svg></button>',
            click: () => {
              const current = NativeFancybox.getSlide()
              if (setUrl && setName) {
                setUrl(current?.src as string)
                setName(current?.triggerEl?.id as string)
              }
              open()
            },
          },
          downloadBtn: {
            tpl: '<button data-fancybox-download href="javascript:;" class="f-button" type="button" title="Скачать"><svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path></svg></button>',
            click: async () => {
              const link = document.createElement('a')
              const current = NativeFancybox.getSlide()
              const res = await fetch(current?.src as string)
              const blob = await res.blob()
              const url = URL.createObjectURL(blob)
              link.href = url
              link.download = current?.triggerEl?.id as string
              link.click()
            },
          },
          mapButton: {
            tpl: '<button data-fancybox-map="javascript:;" class="f-button" type="button" title="Показать на карте"><svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s-6-4.5-6-10.5a6 6 0 0 1 12 0c0 6-6 10.5-6 10.5Zm0 0V18m0 0-3-3m3 3 3-3m-3 3V6m0 0a3 3 0 0 0-3 3c0 3 3 7.5 3 7.5Z"></path></svg></button>',
            click: async () => {
              const current = NativeFancybox.getSlide()
              // @ts-ignore
              setLatitude(current?.fancyboxMap.split(',')[0])
              // @ts-ignore
              setLongitude(current?.fancyboxMap.split(',')[1])
              openMap()
            },
          },
          addTag: {
            tpl: '<button data-fancybox-download data-fancybox-id data-fancybox-id="javascript:;" href="javascript:;" class="f-button" type="button" title="Добавить тэг"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 12H16" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16V8" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>',
            click: () => {
              const current = NativeFancybox.getSlide()
              // @ts-ignore
              setAddTagId(current?.fancyboxId)
              addTagOpen()
            },
          },
        },
        display: {
          left: ['infobar'],
          middle: [
            'zoomIn',
            'zoomOut',
            'toggle1to1',
            'rotateCCW',
            'rotateCW',
            'flipX',
            'flipY',
          ],
          right: [
            'mapButton',
            'edit',
            'addTag',
            'downloadBtn',
            'thumbs',
            'close',
          ],
        },
      },
    }
    // @ts-ignore
    NativeFancybox.bind(container, delegate, options)

    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  })

  return (
    <div ref={containerRef} className='m-5'>
      {children}
    </div>
  )
}

export default Fancybox
