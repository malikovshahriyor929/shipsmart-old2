import { thumbUrl } from '@core/utils/course-utils'
import React from 'react'

const PhotoViewer = ({ url }: { url: string | undefined }) => {
  return (
    <div className='min-h-60 max-w-[300px]  overflow-hidden flex items-center justify-center rounded-lg mx-auto w-full'>
      <img src={ thumbUrl(url, 'avatar') } alt="" className='w-full h-full object-contain rounded-lg' />
    </div>
  )
}

export default PhotoViewer