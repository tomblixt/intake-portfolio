import Scrollbar from 'smooth-scrollbar'

import createMedia from './createMedia'
// import loops from './loops'

export default class MediaView {
  constructor(container, scroll, name, media) {
    this.target = container.querySelector('.content-page')
    this.media = media
    this.name = name
    this.click = 0
    
    this.buildView()
    this.getOffset(scroll)
    this.initScroll()
    this.listeners()
  }
  listeners() {
    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) this.close()
    })
    document.body.addEventListener('click', () =>{
      if (this.click > 0) {
        this.close()
      }
      this.click++
    })
  }
  close () {
    this.mediaView.remove()
  }
  getOffset(scroll) {
    this.setFixed(scroll.offset.y)
    scroll.addListener(({offset}) => {
      this.setFixed(offset.y)
    })
  }
  setFixed(y) {
    this.mediaView.style.top = y + 'px'
  }
  buildView() {
    this.mediaView = document.createElement('div')
    this.mediaView.classList = 'media-view'

    const content = document.createElement('div')
    content.classList = 'media-view__content'

    this.media.forEach(mediaItem => {
      const mediaTag = document.createElement('div')
      mediaTag.classList = 'media-view__media'

      const tag = createMedia(mediaItem, this.name)
      mediaTag.appendChild(tag)

      content.appendChild(mediaTag)
    })

    this.mediaView.appendChild(content)
    this.target.appendChild(this.mediaView)
  }
  initScroll() {
    this.Scroll = Scrollbar.init(this.mediaView, {
      renderByPixels: false,
      damping: 0.05,
      plugins: {
        horizontalScroll: {
          enabled: true
        },
      }
    })

    this.Scroll.track.xAxis.element.remove()
    this.Scroll.track.yAxis.element.remove()

    Scrollbar.detachStyle()
  }
}