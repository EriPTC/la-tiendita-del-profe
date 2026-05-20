// Posts.jsx mantiene la estructura del proyecto original, pero ahora administra publicaciones.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Nav from '../components/Nav'
import PostForm from '../components/PostForm'
import ConfirmModal from '../components/ConfirmModal'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'
const STORAGE_KEY = 'jsonplaceholder_posts'

const markPostSource = (post) => ({
  ...post,
  source: post.source || (Number(post.id) > 100 ? 'local' : 'api')
})

const Posts = () => {
  // Estados principales de la lista.
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const navigate = useNavigate()
  const token = localStorage.getItem('jsonplaceholder_token') || sessionStorage.getItem('jsonplaceholder_token')

  // Estados para el formulario de publicaciones.
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [postSubmitting, setPostSubmitting] = useState(false)
  const [loadingPostDetail, setLoadingPostDetail] = useState(false)
  const [postError, setPostError] = useState('')
  const [postSuccess, setPostSuccess] = useState('')

  // Estados para confirmar la eliminacion.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    // Si no hay token, el usuario vuelve al login.
    if (!token) {
      navigate('/')
      return
    }

    const loadPosts = async () => {
      setLoading(true)
      setError('')

      const storedPosts = localStorage.getItem(STORAGE_KEY)
      if (storedPosts) {
        try {
          setPosts(JSON.parse(storedPosts).map(markPostSource))
          setLoading(false)
          return
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }

      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('Error al cargar las publicaciones')
        }

        const data = await response.json()
        const apiPosts = data.map((post) => ({ ...post, source: 'api' }))
        setPosts(apiPosts)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiPosts))
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las publicaciones')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [navigate, token])

  useEffect(() => {
    // JSONPlaceholder no guarda cambios reales, por eso se conserva una copia local.
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    }
  }, [posts, loading])

  const filteredPosts = posts.filter((post) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [post.id, post.userId, post.title, post.body]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleEditPost = (postId) => {
    setPostError('')
    setLoadingPostDetail(true)

    const postToEdit = posts.find((post) => post.id === postId)
    if (postToEdit) {
      setEditingPost(postToEdit)
      setShowPostForm(true)
    } else {
      setPostError('No se encontro la publicacion')
    }

    setLoadingPostDetail(false)
  }

  const handleCreatePost = async (formData) => {
    setPostError('')
    setPostSuccess('')
    setPostSubmitting(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error creando publicacion')
      }

      await response.json()
      const newId = posts.length > 0 ? Math.max(...posts.map((post) => Number(post.id))) + 1 : 1
      const newPost = { ...formData, id: newId, userId: Number(formData.userId), source: 'local' }

      setPosts((prev) => [newPost, ...prev])
      setPostSuccess('Publicacion creada correctamente.')
      setShowPostForm(false)
      setEditingPost(null)
      setCurrentPage(1)
    } catch (err) {
      setPostError(err.message || 'No se pudo crear la publicacion')
    } finally {
      setPostSubmitting(false)
    }
  }

  const handleUpdatePost = async (formData) => {
    setPostError('')
    setPostSuccess('')
    setPostSubmitting(true)

    try {
      const updatedPost = {
        ...formData,
        id: editingPost.id,
        userId: Number(formData.userId),
        source: editingPost.source || (Number(editingPost.id) > 100 ? 'local' : 'api')
      }

      if (updatedPost.source === 'local') {
        setPosts((prev) => prev.map((post) => (post.id === editingPost.id ? updatedPost : post)))
        setPostSuccess('Publicacion actualizada correctamente.')
        setShowPostForm(false)
        setEditingPost(null)
        return
      }

      const response = await fetch(`${API_URL}/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error actualizando publicacion')
      }

      await response.json()
      setPosts((prev) => prev.map((post) => (post.id === editingPost.id ? updatedPost : post)))
      setPostSuccess('Publicacion actualizada correctamente.')
      setShowPostForm(false)
      setEditingPost(null)
    } catch (err) {
      setPostError(err.message || 'No se pudo actualizar la publicacion')
    } finally {
      setPostSubmitting(false)
    }
  }

  const handleDeletePost = (postId) => {
    setPostToDelete(postId)
    setShowDeleteConfirm(true)
  }

  const confirmDeletePost = async () => {
    if (!postToDelete) return

    setPostError('')
    setPostSuccess('')
    setShowDeleteConfirm(false)

    try {
      const selectedPost = posts.find((post) => post.id === postToDelete)
      const isLocalPost = selectedPost?.source === 'local' || Number(postToDelete) > 100

      if (isLocalPost) {
        setPosts((prev) => prev.filter((post) => post.id !== postToDelete))
        setPostSuccess('Publicacion eliminada correctamente.')
        setPostToDelete(null)
        return
      }

      const response = await fetch(`${API_URL}/${postToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error eliminando publicacion')
      }

      setPosts((prev) => prev.filter((post) => post.id !== postToDelete))
      setPostSuccess('Publicacion eliminada correctamente.')
      setPostToDelete(null)
    } catch (err) {
      setPostError(err.message || 'No se pudo eliminar la publicacion')
      setPostToDelete(null)
    }
  }

  const cancelDeletePost = () => {
    setShowDeleteConfirm(false)
    setPostToDelete(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {token && <Nav />}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Publicaciones</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Total publicaciones</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{filteredPosts.length}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingPost(null)
                  setShowPostForm(true)
                }}
                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Nueva publicacion
              </button>
            </div>
          </div>

          <div className="max-w-xl">
            <label htmlFor="post-search" className="sr-only">Buscar publicaciones</label>
            <input
              id="post-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por titulo, contenido, usuario o ID"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {postError && <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">{postError}</div>}
        {postSuccess && <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">{postSuccess}</div>}

        {showPostForm && (
          <PostForm
            initialData={editingPost || {}}
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            submitting={postSubmitting || loadingPostDetail}
            onClose={() => {
              setShowPostForm(false)
              setEditingPost(null)
            }}
          />
        )}

        <ConfirmModal
          title="Confirmar eliminacion"
          message="Estas seguro de que deseas eliminar esta publicacion?"
          isOpen={showDeleteConfirm}
          isDangerous={true}
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
        />

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="border-b border-slate-200 bg-slate-100 px-6 py-4">
            <h2 className="text-lg font-medium text-slate-900">Listado de publicaciones</h2>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">Cargando publicaciones...</div>
            ) : error ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-6 text-rose-700">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">ID</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Usuario</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Titulo</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Contenido</th>
                      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 align-top text-sm font-semibold text-slate-900">{post.id}</td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            Usuario {post.userId}
                          </span>
                        </td>
                        <td className="max-w-md break-words px-6 py-4 align-top text-sm text-slate-700">{post.title}</td>
                        <td className="max-w-2xl break-words px-6 py-4 align-top text-sm text-slate-600">{post.body}</td>
                        <td className="px-6 py-4 align-top text-sm text-slate-700">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPost(post.id)}
                              disabled={loadingPostDetail}
                              className="rounded-full bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="rounded-full bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Pagina {currentPage} de {totalPages}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Anterior
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Posts
