export default function authHeader() {
  const localStorageUser = localStorage.getItem('user')
  const user = localStorageUser ? JSON.parse(localStorageUser) : undefined

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken }
  } else {
    return {}
  }
}
