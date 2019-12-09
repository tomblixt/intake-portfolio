import '../sass/style.scss'

import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'
import gsap from 'gsap'

import loops from './loops'
import Cursor from './cursor'
// pages
import Home from './pages/home'
import WorkPage from './pages/work'

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
        return enterWorkPage(next)
      },
      beforeEnter({ next }) {
        return enterWorkPage(next)
      },
      beforeLeave({ current }) {
        return leavePage(current)
      }
    }
  ]
})

const cursor = new Cursor()

// Init pages
const enterHome = next => {
  const { container } = next
  const home = new Home(container)

  loops(container)
  cursor.setLinks(container)

  return home.animateIn()
}

const enterWorkPage = next => {
  const { container, namespace } = next
  const work = new WorkPage(container, namespace)
  
  loops(container)
  cursor.setLinks(container)

  return work.animateIn()
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
