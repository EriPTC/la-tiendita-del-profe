// PostForm.jsx renderiza el formulario para crear o editar una publicacion.
import { useState, useEffect, useRef } from 'react' // useRef para detectar clicks fuera del modal, useEffect para escuchar Escape.

const PostForm = ({ initialData = {}, onSubmit, submitting = false, onClose }) => {
    // Si initialData viene con valores, se rellena el formulario con ellos.
  const [form, setForm] = useState(() => ({
    userId: '',
    title: '',
    body: '',
    ...initialData
  }))
  const isEditing = !!initialData?.id

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      userId: Number(form.userId),
      title: form.title.trim(),
      body: form.body.trim()
    }

    onSubmit && onSubmit(payload)
  }

    const overlayRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose && onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-slate-900">
            {isEditing ? 'Editar publicacion' : 'Nueva publicacion'}
          </h3>
          <button
            type="button"
            onClick={() => onClose && onClose()}
            className="-mr-2 inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <form className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {/* Campo de título del producto. */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Usuario</label>
            <input
              name="userId"
              type="number"
              min="1"
              value={form.userId}
              onChange={handleChange}
              placeholder="1"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Titulo</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titulo de la publicacion"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Contenido</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Contenido de la publicacion"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              rows={5}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose && onClose()}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? 'Guardando...' : isEditing ? 'Actualizar publicacion' : 'Guardar publicacion'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostForm
