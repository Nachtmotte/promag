import { useState, useEffect } from 'react'

import { login, create, logout, isLogged, autoLogin } from './services/users'

function App () {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  function cleanInputs () {
    setEmail('')
    setUsername('')
    setPassword('')
  }

  async function handleLogin () {
    const loginData = await login(username, password)
    if (!loginData.error) {
      cleanInputs()
      setUser(loginData.user)
    } else setErrorMessage(loginData.error)
  }

  async function handleCreate () {
    const createData = await create(email, username, password)
    if (!createData.error) {
      cleanInputs()
      setUser(createData.user)
    } else setErrorMessage(createData.error)
  }

  function handleLogout () {
    logout()
    setUser(null)
  }

  useEffect(() => {
    async function relogin () {
      const loginData = await autoLogin()
      setUser(loginData?.user)
    }
    if (isLogged) relogin()
  }, [])

  useEffect(() => {
    setErrorMessage('')
  }, [username, password, email])

  useEffect(() => {
    cleanInputs()
  }, [isRegistering])

  return (
    <div className='h-screen bg-gray-100'>
      <div className='flex h-full items-center justify-center'>
        <div className='px-8 py-4 border border-gray-400 rounded max-w-md'>
          {user
            ? (
              <div className='flex flex-col'>
                <h2 className='text-xl font-bold'>User:</h2>
                <div className='p-2 rounded-md border border-gray-400 bg-white'>
                  {Object.keys(user).map(key =>
                    <div key={key}>
                      <div className='grid grid-cols-12'>
                        <p className='font-bold pr-1 col-span-5'>{key}:</p>
                        <p className='col-span-7 break-words'>{user[key]}</p>
                      </div>
                      <div className='border-b border-gray-400' />
                    </div>
                  )}
                </div>
                <div className='flex justify-center mt-2'>
                  <button onClick={handleLogout} className='w-fit bg-slate-300 px-3 py-2 rounded'>Logout</button>
                </div>
              </div>)
            : (
              <div className='flex flex-col gap-2'>
                <h2 className='text-xl font-bold text-center'>{isRegistering ? 'New User' : 'Welcome'}</h2>
                {isRegistering &&
                  <div className='flex flex-col gap-1'>
                    <label>Email</label>
                    <input className='p-2 rounded' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>}
                <div className='flex flex-col gap-1'>
                  <label>Username</label>
                  <input className='p-2 rounded' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1'>
                  <label>Password</label>
                  <input type='password' className='p-2 rounded' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='flex justify-center mt-2 gap-4'>
                  <button onClick={() => setIsRegistering(!isRegistering)} className='w-fit bg-slate-300 px-3 py-2 rounded'>{isRegistering ? 'Cancel' : 'SignUp'}</button>
                  <button onClick={isRegistering ? handleCreate : handleLogin} className='w-fit bg-slate-300 px-3 py-2 rounded'>{isRegistering ? 'Create' : 'Login'}</button>
                </div>
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
              </div>)}
        </div>
      </div>
    </div>
  )
}

export default App
