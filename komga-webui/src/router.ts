import urls from '@/functions/urls'
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import {LIBRARIES_ALL, LIBRARY_ROUTE} from '@/types/library'

const qs = require('qs')

Vue.use(Router)

const lStore = store as any
const scrollMemoryRoutes = new Set<string>([
  'browse-libraries',
  'browse-books',
  'browse-collections',
  'browse-readlists',
  'browse-collection',
  'browse-readlist',
  'browse-series',
])
const savedScrollPositions: Record<string, number> = {}
const getScrollKey = (route: any) => `${route?.name || route?.path}:${JSON.stringify(route?.params || {})}:${route?.fullPath || ''}`
const getScrollElement = (): HTMLElement | null => {
  // Vuetify 2 scroll container; fallback to document scrolling element
  return document.querySelector('.v-main__wrap') as HTMLElement || document.scrollingElement as HTMLElement || null
}
const getCurrentScroll = (): number => {
  const el = getScrollElement()
  const containerScroll = el ? el.scrollTop : 0
  const windowScroll = window.pageYOffset || 0
  return Math.max(containerScroll, windowScroll)
}

const adminGuard = (to: any, from: any, next: any) => {
  if (!lStore.getters.meAdmin) next({name: 'home'})
  else next()
}

const noLibraryGuard = (to: any, from: any, next: any) => {
  if (lStore.state.komgaLibraries.libraries.length === 0) {
    next({name: 'welcome'})
  } else next()
}

const noLibraryNorPinGuard = (to: any, from: any, next: any) => {
  if (lStore.state.komgaLibraries.libraries.length === 0) {
    next({name: 'welcome'})
  } else if (lStore.getters.getLibrariesPinned.length === 0) {
    next({name: 'no-pins'})
  } else next()
}

const getLibraryRoute = (libraryId: string) => {
  switch ((lStore.getters.getLibraryRoute(libraryId) as LIBRARY_ROUTE)) {
    case LIBRARY_ROUTE.COLLECTIONS:
      return 'browse-collections'
    case LIBRARY_ROUTE.READLISTS:
      return 'browse-readlists'
    case LIBRARY_ROUTE.BROWSE:
      return 'browse-libraries'
    case LIBRARY_ROUTE.BOOKS:
      return 'browse-books'
    case LIBRARY_ROUTE.RECOMMENDED:
    default:
      return libraryId === LIBRARIES_ALL ? 'browse-libraries' : 'recommended-libraries'
  }
}

const router = new Router({
  mode: 'history',
  base: urls.base,
  parseQuery(query: string) {
    return qs.parse(query)
  },
  stringifyQuery(query: Object) {
    const res = qs.stringify(query)
    return res ? `?${res}` : ''
  },
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {name: 'dashboard'},
      component: () => import(/* webpackChunkName: "home" */ './views/HomeView.vue'),
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: () => import(/* webpackChunkName: "welcome" */ './views/WelcomeView.vue'),
        },
        {
          path: '/no-pins',
          name: 'no-pins',
          component: () => import(/* webpackChunkName: "no-pins" */ './views/NoPinnedLibraries.vue'),
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          beforeEnter: noLibraryNorPinGuard,
          component: () => import(/* webpackChunkName: "dashboard" */ './views/DashboardView.vue'),
        },
        {
          path: '/settings/users',
          name: 'settings-users',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "settings-users" */ './views/SettingsUsers.vue'),
          children: [
            {
              path: '/settings/users/add',
              name: 'settings-users-add',
              component: () => import(/* webpackChunkName: "settings-user" */ './components/dialogs/UserAddDialog.vue'),
            },
          ],
        },
        {
          path: '/settings/server',
          name: 'settings-server',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "settings-server" */ './views/SettingsServer.vue'),
        },
        {
          path: '/settings/ui',
          name: 'settings-ui',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "settings-ui" */ './views/UISettings.vue'),
        },
        {
          path: '/settings/metrics',
          name: 'metrics',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "metrics" */ './views/MetricsView.vue'),
        },
        {
          path: '/settings/announcements',
          name: 'announcements',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "announcements" */ './views/AnnouncementsView.vue'),
        },
        {
          path: '/settings/updates',
          name: 'updates',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "updates" */ './views/UpdatesView.vue'),
        },
        {
          path: '/media-management/analysis',
          name: 'media-analysis',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "media-analysis" */ './views/MediaAnalysis.vue'),
        },
        {
          path: '/media-management/missing-posters',
          name: 'missing-posters',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "missing-posters" */ './views/MissingPosters.vue'),
        },
        {
          path: '/media-management/duplicate-files',
          name: 'duplicate-files',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "duplicate-files" */ './views/DuplicateFiles.vue'),
        },
        {
          path: '/media-management/duplicate-pages/known',
          name: 'settings-duplicate-pages-known',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "duplicate-pages-known" */ './views/DuplicatePagesKnown.vue'),
        },
        {
          path: '/media-management/duplicate-pages/unknown',
          name: 'settings-duplicate-pages-unknown',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "duplicate-pages-new" */ './views/DuplicatePagesUnknown.vue'),
        },
        {
          path: '/history',
          name: 'history',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "history" */ './views/HistoryView.vue'),
        },
        {
          path: '/account/me',
          name: 'account-me',
          component: () => import(/* webpackChunkName: "account-me" */ './views/AccountView.vue'),
        },
        {
          path: '/account/api-keys',
          name: 'account-api-keys',
          component: () => import(/* webpackChunkName: "account-api-keys" */ './views/ApiKeys.vue'),
        },
        {
          path: '/account/settings-ui',
          name: 'account-settings-ui',
          component: () => import(/* webpackChunkName: "account-settings-ui" */ './views/UIUserSettings.vue'),
        },
        {
          path: '/account/authentication-activity',
          name: 'account-activity',
          component: () => import(/* webpackChunkName: "account-activity" */ './views/SelfAuthenticationActivity.vue'),
        },
        {
          path: '/libraries/:libraryId?',
          name: 'libraries',
          redirect: (route) => ({
            name: getLibraryRoute(route.params.libraryId || LIBRARIES_ALL),
            params: {libraryId: route.params.libraryId || LIBRARIES_ALL},
          }),
        },
        {
          path: '/libraries/:libraryId/recommended',
          name: 'recommended-libraries',
          beforeEnter: noLibraryGuard,
          component: () => import(/* webpackChunkName: "dashboard" */ './views/DashboardView.vue'),
          props: (route) => ({libraryId: route.params.libraryId}),
        },
        {
          path: '/libraries/:libraryId/books',
          name: 'browse-books',
          beforeEnter: noLibraryGuard,
          component: () => import(/* webpackChunkName: "browse-books" */ './views/BrowseBooks.vue'),
          props: (route) => ({libraryId: route.params.libraryId}),
        },
        {
          path: '/libraries/:libraryId/series',
          name: 'browse-libraries',
          beforeEnter: noLibraryGuard,
          component: () => import(/* webpackChunkName: "browse-libraries" */ './views/BrowseLibraries.vue'),
          props: (route) => ({libraryId: route.params.libraryId}),
        },
        {
          path: '/libraries/:libraryId/collections',
          name: 'browse-collections',
          beforeEnter: noLibraryGuard,
          component: () => import(/* webpackChunkName: "browse-collections" */ './views/BrowseCollections.vue'),
          props: (route) => ({libraryId: route.params.libraryId}),
        },
        {
          path: '/libraries/:libraryId/readlists',
          name: 'browse-readlists',
          beforeEnter: noLibraryGuard,
          component: () => import(/* webpackChunkName: "browse-readlists" */ './views/BrowseReadLists.vue'),
          props: (route) => ({libraryId: route.params.libraryId}),
        },
        {
          path: '/collections/:collectionId',
          name: 'browse-collection',
          component: () => import(/* webpackChunkName: "browse-collection" */ './views/BrowseCollection.vue'),
          props: (route) => ({collectionId: route.params.collectionId}),
        },
        {
          path: '/readlists/:readListId',
          name: 'browse-readlist',
          component: () => import(/* webpackChunkName: "browse-readlist" */ './views/BrowseReadList.vue'),
          props: (route) => ({readListId: route.params.readListId}),
        },
        {
          path: '/series/:seriesId',
          name: 'browse-series',
          component: () => import(/* webpackChunkName: "browse-series" */ './views/BrowseSeries.vue'),
          props: (route) => ({seriesId: route.params.seriesId}),
        },
        {
          path: '/book/:bookId',
          name: 'browse-book',
          component: () => import(/* webpackChunkName: "browse-book" */ './views/BrowseBook.vue'),
          props: (route) => ({bookId: route.params.bookId}),
        },
        {
          path: '/oneshot/:seriesId',
          name: 'browse-oneshot',
          component: () => import(/* webpackChunkName: "browse-oneshot" */ './views/BrowseOneshot.vue'),
          props: (route) => ({seriesId: route.params.seriesId}),
        },
        {
          path: '/search',
          name: 'search',
          component: () => import(/* webpackChunkName: "search" */ './views/SearchView.vue'),
        },
        {
          path: '/import/books',
          name: 'import-books',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "import-books" */ './views/ImportBooks.vue'),
        },
        {
          path: '/import/readlist',
          name: 'import-readlist',
          beforeEnter: adminGuard,
          component: () => import(/* webpackChunkName: "import-readlist" */ './views/ImportReadList.vue'),
        },
      ],
    },
    {
      path: '/startup',
      name: 'startup',
      component: () => import(/* webpackChunkName: "startup" */ './views/StartupView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/LoginView.vue'),
    },
    {
      path: '/book/:bookId/read',
      name: 'read-book',
      component: () => import(/* webpackChunkName: "read-book" */ './views/DivinaReader.vue'),
      props: (route) => ({bookId: route.params.bookId}),
    },
    {
      path: '/book/:bookId/read-epub',
      name: 'read-epub',
      component: () => import(/* webpackChunkName: "read-epub" */ './views/EpubReader.vue'),
      props: (route) => ({bookId: route.params.bookId}),
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import(/* webpackChunkName: "notfound" */ './views/PageNotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Debug scroll restore
    console.debug('[scrollBehavior] to:', to.name, JSON.stringify(to.params), 'from:', from.name, JSON.stringify(from.params), 'savedPosition:', JSON.stringify(savedPosition))
    const targetPosition = (() => {
      if (scrollMemoryRoutes.has(to.name as string)) {
        const manualPosition = savedScrollPositions[getScrollKey(to)]
        console.debug('[scrollBehavior] manual position lookup', getScrollKey(to), manualPosition)
        if (typeof manualPosition === 'number') return manualPosition
      }
      if (to.name === from.name && to.fullPath !== from.fullPath) return 0
      if (savedPosition) return savedPosition.y
      if (to.name !== from.name) return 0
      return undefined
    })()

    if (typeof targetPosition !== 'number') return

    return new Promise((resolve) => {
      const applyScroll = (attempt: number) => {
        const el = getScrollElement()
        const scrollableHeight = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight

        if (scrollableHeight < targetPosition && attempt < 10) {
          console.debug('[scrollBehavior] wait content', {attempt, scrollableHeight, targetPosition})
          setTimeout(() => applyScroll(attempt + 1), 50)
          return
        }

        if (el) {
          console.debug('[scrollBehavior] applying scroll to container', el.className, '->', targetPosition)
          el.scrollTo({top: targetPosition, behavior: 'auto'})
        } else {
          console.debug('[scrollBehavior] applying scroll to window ->', targetPosition)
          window.scrollTo({top: targetPosition, left: 0})
        }
        // make sure both scroll targets are in sync
        window.scrollTo({top: targetPosition, left: 0})
        resolve({x: 0, y: targetPosition})
      }
      Vue.nextTick(() => applyScroll(0))
    })
  },
})

router.beforeEach((to, from, next) => {
  const sameRouteDifferentPath = to.name === from.name && to.fullPath !== from.fullPath
  if (scrollMemoryRoutes.has(from.name as string)) {
    if (sameRouteDifferentPath) {
      delete savedScrollPositions[getScrollKey(from)]
      console.debug('[scrollMemory] clear (pagination)', getScrollKey(from))
    } else {
      const current = getCurrentScroll()
      savedScrollPositions[getScrollKey(from)] = current
      console.debug('[scrollMemory] save', getScrollKey(from), '=>', current, 'container:', getScrollElement()?.className)
    }
  }
  console.debug('[scrollMemory] to:', to.name, 'from:', from.name, 'savedKeys:', JSON.stringify(Object.keys(savedScrollPositions)))

  // avoid document.title flickering when changing route
  if (!['read-book', 'read-epub', 'browse-book', 'browse-oneshot', 'browse-series', 'browse-libraries', 'browse-books',
    'recommended-libraries', 'browse-collection', 'browse-collections', 'browse-readlist', 'browse-readlists'].includes(<string>to.name)
  ) {
    document.title = 'Komga'
  }

  if (window.opener !== null &&
    window.name === 'oauth2Login' &&
    to.query.server_redirect === 'Y'
  ) {
    if (!to.query.error) {
      // authentication succeeded, we redirect the parent window so that it can login via cookie
      window.opener.location.href = urls.origin
    } else {
      // authentication failed, we cascade the error message to the parent
      window.opener.location.href = window.location
    }
    // we can close the popup
    window.close()
  }

  if (to.name !== 'startup' && to.name !== 'login' && !lStore.getters.authenticated) {
    const query = Object.assign({}, to.query, {redirect: to.fullPath})
    next({name: 'startup', query: query})
  } else next()
})

export default router
