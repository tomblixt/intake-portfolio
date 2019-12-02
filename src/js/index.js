import '../sass/style.scss'

import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'
import gsap from 'gsap'

import loops from './loops'
import Cursor from './cursor'
import Home from './pages/home'

const isDebug = process.env.NODE_ENV === 'development'

barba.use(barbaPrefetch)

barba.init({
  debug: isDebug,
  transitions: [
    {
      name: 'toHome',
      once({ next }) {
        return enterHome(next)
      },
      beforeEnter({ next }) {
        return enterHome(next)
      },
      beforeLeave({ current }) {
        return leavePage(current)
      },
      to: {
        namespace: [
          'home'
        ]
      }
    },
    {
      name: 'toPage',
      once({ next }) {
        enterPages(next)
      },
      beforeEnter({ next }) {
        enterPages(next)
      },
      beforeLeave({ current }) {
        return leavePage(current)
      }
    }
  ]
})

const cursor = new Cursor()

// Init pages
const enterHome = (next, callback) => {
  const { container } = next
  return new Promise(resolve => {
    loops(container)
    cursor.setLinks(container)
    const home = new Home(container)
    home.animateIn().then(() => {
      resolve()
    })
  })
}

const enterPages = next => {
  const { container } = next
  loops(container)
  cursor.setLinks(container)
}

const leavePage = current => {
  const { container } = current
  return new Promise(resolve => {
    gsap.to(container, .6, { alpha: 0, onComplete: () => {
        cursor.leaveLink()
        container.remove()
        resolve()
      } 
    })
  })
}