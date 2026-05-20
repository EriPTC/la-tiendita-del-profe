// Home.jsx muestra la pantalla principal despues del login.
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Nav from '../components/Nav'

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('jsonplaceholder_token') || sessionStorage.getItem('jsonplaceholder_token')
  const user = localStorage.getItem('jsonplaceholder_user') || sessionStorage.getItem('jsonplaceholder_user') || ''

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [navigate, token])

  const handleLogout = () => {
    localStorage.removeItem('jsonplaceholder_token')
    localStorage.removeItem('jsonplaceholder_user')
    localStorage.removeItem('jsonplaceholder_email')
    sessionStorage.removeItem('jsonplaceholder_token')
    sessionStorage.removeItem('jsonplaceholder_user')
    sessionStorage.removeItem('jsonplaceholder_email')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {token && <Nav />}
      <div className="flex flex-grow flex-col items-center justify-center px-4 text-center">
        <header>
          <h1 className="text-4xl font-bold text-blue-600">
            Bienvenido {user ? `, ${user}` : ''}
          </h1>
          <p className="mt-4 text-gray-700">Administra publicaciones consumidas desde JSONPlaceholder.</p>
        </header>
        <main className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate('/posts')} className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500">
            Ver publicaciones
          </button>
          <button onClick={handleLogout} className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600">
            Cerrar sesion
          </button>
        </main>
      </div>
    </div>
  )
}

export default Home
