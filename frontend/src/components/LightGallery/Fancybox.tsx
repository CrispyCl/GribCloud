import React, { FunctionComponent, useEffect, useRef } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

interface Fancybox {
  children: React.ReactNode
  open: () => void
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
}

const Fancybox: FunctionComponent<Fancybox> = ({
  children,
  setUrl,
  setName,
  open,
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
          right: ['edit', 'downloadBtn', 'thumbs', 'close'],
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
