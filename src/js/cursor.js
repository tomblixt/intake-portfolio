import gsap, { Power2 } from 'gsap'

export default class Cursor {
  constructor(links) {
    this.createCursor()
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.links = document.querySelectorAll('a')

    this.listeners()
    this.animateCursor()
  }
  listeners() {
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
    document.addEventListener('mousedown', e => {
      this.cursor.classList.add('holding')
    })
    document.addEventListener('mouseup', e => {
      this.cursor.classList.remove('holding')
    })
  }
  createCursor() {
    this.cursor = document.createElement('div')
    this.cursor.classList.add('cursor')
    document.body.appendChild(this.cursor)
  }
  setLinks(links) {
    this.links = document.querySelectorAll('a')
    this.links.forEach(link => {
      link.addEventListener('mouseenter', this.enterLink.bind(this))
      link.addEventListener('mouseleave', this.leaveLink.bind(this))
    })
  }
  enterLink() {
    this.cursor.classList.add('hover')
  }
  leaveLink() {
    this.cursor.classList.remove('hover')
  }
  animateCursor() {
    gsap.to(this.cursor, .2, {
      css: {
        left: this.mouse.x,
        top: this.mouse.y
      },
      ease: Power2.easeOut
    })

    requestAnimationFrame(this.animateCursor.bind(this))
  }
}