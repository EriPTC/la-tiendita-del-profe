// Login.jsx contiene una autenticacion local simple para la practica.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const users = [
  {
    id: 1,
    email: 'john@gmail.com',
    username: 'johnd',
    password: 'm38rmF$'
  },
  {
    id: 2,
    email: 'morrison@gmail.com',
    username: 'mor_2314',
    password: '83r5^_'
  },
  {
    id: 3,
    email: 'kevin@gmail.com',
    username: 'kevinryan',
    password: 'kev02937@'
  }
]

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('jsonplaceholder_token') || sessionStorage.getItem('jsonplaceholder_token')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Por favor completa email y contrasena.')
      return
    }

    setLoading(true)

    try {
      const user = users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
      )

      if (!user) {
        throw new Error('Email o contrasena incorrectos.')
      }

      const token = `token-${user.id}-${Date.now()}`
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('jsonplaceholder_token', token)
      storage.setItem('jsonplaceholder_user', user.username)
      storage.setItem('jsonplaceholder_email', user.email)

      navigate('/home')
    } catch (error_) {
      setError(error_.message || 'Error al iniciar sesion. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/50 md:flex-row md:items-center md:p-10">
        <div className="w-full">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Inicia sesion</h1>
            <p className="mt-3 text-sm text-slate-600">CRUD de publicaciones con JSONPlaceholder.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Guardar sesion
              </label>
              <span className="text-sm font-semibold text-indigo-600">john@gmail.com / m38rmF$</span>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
