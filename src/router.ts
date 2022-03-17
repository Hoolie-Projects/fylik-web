import { createRouter } from "router5"
import browserPlugin from "router5-plugin-browser"

const router = createRouter([
  {name: 'main', path: '/main'},
  {name: 'about', path: '/about'},
  {name: 'terms', path: '/terms'},
], {
  defaultRoute: 'main'
})

router.usePlugin(browserPlugin())

router.useMiddleware(() => (fromState, toState, done) => {

  if (!fromState || !toState) return done()

  if (fromState.name !== toState.name)
    window.scrollTo(0, 0)

  done()
})

export default router
