import lgHash from 'lightgallery/plugins/hash'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import React, { FunctionComponent } from 'react'
// import styles
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lightgallery.css'

interface LightGalleryProps {
  children?: React.ReactNode
}

const LightGalleryComponent: FunctionComponent<LightGalleryProps> = props => {
  return (
    <LightGallery plugins={[lgThumbnail, lgZoom, lgHash, lgVideo]} speed={500}>
      {props.children}
    </LightGallery>
  )
}

export default LightGalleryComponent
