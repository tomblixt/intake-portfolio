import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll'
import gsap, { Power2 } from 'gsap'

// Data
import nevercreatedData from '../data/nevercreated.json'
import enjojData from '../data/enjoj.json'
import persoonlijkData from '../data/persoonlijk.json'

Scrollbar.use(OverscrollPlugin)

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
    this.wrapper = container.querySelector('.wrapper')
    this.parallaxItems = []

    this.buildItems()
    this.setLineHeight()
    // scroll
    this.initScroll()
    this.animateParallax()
  }
  animateIn() {
    const that = this
    return new Promise(resolve => {
      const delay = .4
      const timeline = gsap.timeline({
        defaults: {
          duration: .8
        },
        onComplete() {
          resolve()
        }
      })
      timeline
        .set(this.wrapper, { alpha: 0, y: '45%' })
        .to(this.wrapper, { alpha: 1, y: 0 }, delay)
    })
  }
  initScroll() {
    this.scroll = Scrollbar.init(this.container, {renderByPixels: false});
    this.scroll.track.xAxis.element.remove()
    this.scroll.track.yAxis.element.remove()    
    this.scroll.addListener((s) => this.onScroll(s))
  }
  onScroll({ offset }) {
    this.animateParallax(offset.y)
  }
  buildItems() {
    const workTag = this.container.querySelector('.work')
    this.workData.forEach(item => {
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
      textp.innerText = item.text
      itemTitle.appendChild(textp)
      
      // content
      const itemContent = document.createElement('div')
      itemContent.className = 'work-item__content'
      itemContent.style.height = item.height + 'px'

      const media = []
      let speed = 0.4
      item.media.forEach(mediaItem => {
        const mediaTag = document.createElement('div')
        mediaTag.classList = 'work-item__media'
        gsap.set(mediaTag, { css: mediaItem.style })

        let tag
        if (mediaItem.type === 'img') {
          tag = document.createElement('img')
          tag.src = mediaItem.path
        }
        mediaTag.appendChild(tag)
        media.push({ tag, speed })
        speed += 0.6

        itemContent.appendChild(mediaTag)
      })

      itemTag.appendChild(itemContent)
      itemTag.appendChild(itemTitle)

      workTag.appendChild(itemTag)
      this.parallaxItems.push({ main: itemTag, media })
    })
  }
  setLineHeight() {
    const line = this.container.querySelector('.line-wrapper')
    let height = 54
    this.workData.forEach(item => {
      height += (item.height - item.indent)
    })
    height -= this.workData[(this.workData.length - 1)].height / 2
    line.style.height = height + 'px'
  }
  animateParallax(offset = 0) {
    const screenCenter = window.innerHeight / 2 + offset
    this.parallaxItems.forEach(({ main, media }) => {
      const itemTop = main.offsetTop
      const itemCenter = main.offsetHeight / 2
      const itemPos = itemCenter + itemTop
      const distanse = itemPos / screenCenter * 100 - 100

      media.forEach(({ tag, speed }) => {
        gsap.set(tag, { y: distanse * speed })
      })
    })
  }
}