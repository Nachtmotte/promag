const urlBase = `${process.env.BACKEND_HOST || 'http://localhost'}:3000/`

export async function login (username, password) {
  const response = await fetch(`${urlBase}login`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password
    })
  })

  const { user, token, refresh_token: refreshToken, error } = await response.json()

  if (!response.ok) return { error }

  setTokensInLocalStorage(token, refreshToken)

  return { user }
}

export async function create (email, username, password) {
  const response = await fetch(`${urlBase}create`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      username,
      password
    })
  })

  const { user, token, refresh_token: refreshToken, error } = await response.json()

  if (!response.ok) return { error }

  setTokensInLocalStorage(token, refreshToken)

  return { user }
}

export async function autoLogin () {
  const token = window.localStorage.getItem('token')
  if (!token) return

  const response = await fetch(`${urlBase}auto_login`, {
    headers: new Headers({ Authorization: token })
  })

  let user = null
  if (response.ok) {
    user = await response.json()
  } else if (response.status === 401) {
    user = await autoLoginWithRefreshToken()
  }

  if (!user) {
    logout()
    return null
  }

  return { user }
}

export async function autoLoginWithRefreshToken () {
  const refreshT = window.localStorage.getItem('refresh_token')
  if (!refreshT) return

  const response = await fetch(`${urlBase}refresh_login`, {
    headers: new Headers({ Authorization: refreshT })
  })

  if (!response.ok) return null

  const { user, token, refresh_token: refreshToken } = await response.json()

  setTokensInLocalStorage(token, refreshToken)

  return user
}

export function isLogged () {
  return !!window.localStorage.getItem('token') &&
  !!window.localStorage.getItem('refresh_token')
}

export function logout () {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('refresh_token')
}

function setTokensInLocalStorage (token, refreshToken) {
  window.localStorage.setItem('token', `Bearer ${token}`)
  window.localStorage.setItem('refresh_token', `Bearer ${refreshToken}`)
}
