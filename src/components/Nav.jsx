// Nav.jsx define la barra de navegacion visible cuando hay sesion.
import { Link } from 'react-router'

const Nav = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-lg font-bold">CRUD JSONPlaceholder</div>

        {/* Se usa una lista horizontal para los enlaces de navegación. */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/home" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/posts" className="hover:text-gray-200">
              Publicaciones
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
