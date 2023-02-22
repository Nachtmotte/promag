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

  const jsonResponse = await response.json()

  if (!response.ok) return { error: jsonResponse.error }

  window.localStorage.setItem('token', `Bearer ${jsonResponse.token}`)

  return { user: jsonResponse.user }
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

  const jsonResponse = await response.json()

  if (!response.ok) return { error: jsonResponse.error }

  window.localStorage.setItem('token', `Bearer ${jsonResponse.token}`)

  return { user: jsonResponse.user }
}

export async function autoLogin () {
  const token = window.localStorage.getItem('token')
  if (!token) return

  const response = await fetch(`${urlBase}auto_login`, {
    headers: new Headers({ Authorization: token })
  })

  if (!response.ok) {
    logout()
    return null
  }

  const user = await response.json()
  return { user }
}

export function isLogged () {
  return !!window.localStorage.getItem('token')
}

export function logout () {
  window.localStorage.removeItem('token')
}
