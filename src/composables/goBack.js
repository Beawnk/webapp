import { useRouter } from 'vue-router'

// Goes back to the previous page of the app. When the page was opened directly
// (link, reload in a new tab), there is no previous app page and router.back()
// would leave the site, so it goes to the fallback route instead.
export function useGoBack(fallback) {
  const router = useRouter()

  return () => {
    if (window.history.state?.back) {
      router.back()
    } else {
      router.push(fallback)
    }
  }
}
