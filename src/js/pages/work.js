import Scrollbar from 'smooth-scrollbar'
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll'
import HorizontalScrollPlugin from '../utils/horizontalScrollPlugin'

import gsap, { Power2 } from 'gsap'

import MediaView from './mediaView'
import createMedia from './createMedia'

// Data
import nevercreatedData from '../../data/nevercreated.json'
import enjojData from '../../data/enjoj.json'
import persoonlijkData from '../../data/persoonlijk.json'

Scrollbar.use(HorizontalScrollPlugin, OverscrollPlugin)

export default class WorkPage {
  constructor(container, name) {
    if (name === 'nevercreated') {
      this.workData = nevercreatedData
    } else if (name === 'enjoj') {
      this.workData = enjojData
    } else if (name === 'persoonlijk') {
      this.workData = persoonlijkData
    } else {
      return
    }

    this.container = container
    this.name = name
    this.wrapper = container.querySelector('.wrapper')
    this.mediaItems = []

    this.buildItems()
    this.setLineHeight()

    this.initScroll()
    this.listeners()
    this.animateParallax()
  }
  animateIn() {
    const that = this
    return new Promise((resolve) => {
      const delay = 0.4
      const timeline = gsap.timeline({
        defaults: {
          duration: 0.8,
        },
        onComplete() {
          resolve()
        },
      })
      timeline
        .set(this.wrapper, { alpha: 0, y: '45%' })
        .to(this.wrapper, { alpha: 1, y: 0, ease: Power2.easeOut }, delay)
    })
  }
  listeners() {
    window.addEventListener(
      'resize',
      this.animateParallax.bind(this, this.scroll.offset.y)
    )
    this.mediaItems.forEach(({ data, media }) => {
      media.forEach(({ tag }) => {
        tag.addEventListener(
          'click',
          () => new MediaView(this.container, this.scroll, this.name, data)
        )
      })
    })
  }
  initScroll() {
    this.scroll = Scrollbar.init(this.container, { renderByPixels: false })
    this.scroll.track.xAxis.element.remove()
    this.scroll.track.yAxis.element.remove()
    this.scroll.addListener((s) => this.onScroll(s))
  }
  onScroll({ offset }) {
    this.animateParallax(offset.y)
  }
  buildItems() {
    const workTag = this.container.querySelector('.work')
    this.workData.forEach((item) => {
      // work item
      const itemTag = document.createElement('div')
      itemTag.className = 'work-item'
      itemTag.style.marginTop = -item.indent + 'px'

      // title
      const itemTitle = document.createElement('div')
      itemTitle.className = 'work-item__title'
      const texth3 = document.createElement('h3')
      texth3.innerText = item.title
      itemTitle.appendChild(texth3)
      const textp = document.createElement('p')
      textp.innerHTML = item.text
      itemTitle.appendChild(textp)

      // content
      const itemContent = document.createElement('div')
      itemContent.className = 'work-item__content'
      itemContent.style.height = item.height + 'px'

      const media = []
      let speed = 0.4
      item.media.forEach((mediaItem) => {
        const mediaTag = document.createElement('div')
        mediaTag.classList = 'work-item__media cursor-highlight'
        gsap.set(mediaTag, { css: mediaItem.style })

        const tag = createMedia(mediaItem, this.name)
        mediaTag.appendChild(tag)

        media.push({ tag, speed })
        speed += 0.8

        itemContent.appendChild(mediaTag)
      })

      itemTag.appendChild(itemContent)
      itemTag.appendChild(itemTitle)

      workTag.appendChild(itemTag)
      this.mediaItems.push({ main: itemTag, data: item.media, media })
    })
  }
  setLineHeight() {
    const line = this.container.querySelector('.line-wrapper')
    let height = 86
    this.workData.forEach((item) => {
      height += item.height - item.indent
    })
    height -= this.workData[this.workData.length - 1].height / 2
    line.style.height = height + 'px'
  }
  animateParallax(offset = 0) {
    const screenCenter = window.innerHeight / 2 + offset
    this.mediaItems.forEach(({ main, media }) => {
      const itemTop = main.offsetTop
      const itemCenter = main.offsetHeight / 2
      const itemPos = itemCenter + itemTop
      const distanse = (itemPos / screenCenter) * 100 - 100

      media.forEach(({ tag, speed }) => {
        gsap.set(tag, { y: distanse * speed })
      })
    })
  }
}
