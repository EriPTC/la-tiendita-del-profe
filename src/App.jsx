// App.jsx define las rutas principales de la aplicacion.
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/products" element={<Posts />} />
      </Routes>
    </Router>
  )
}

export default App
