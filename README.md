# CRUD de publicaciones con React

Proyecto basado en `la-tiendita-del-profe`, adaptado para consumir:

- API: `https://jsonplaceholder.typicode.com/`
- Recurso CRUD: `https://jsonplaceholder.typicode.com/posts`

## Funcionalidades

- Login local de practica.
- Listado de publicaciones desde la API.
- Busqueda por ID, usuario, titulo o contenido.
- Paginacion.
- Crear publicacion.
- Editar publicacion.
- Eliminar publicacion.
- Persistencia local con `localStorage`.
- Ruta principal del CRUD: `/posts`.

JSONPlaceholder simula las operaciones `POST`, `PUT` y `DELETE`, pero no guarda cambios reales en el servidor. Por eso el proyecto guarda una copia en `localStorage` para que el CRUD se vea funcional durante la prueba.

## Credencial de prueba

- Email: `john@gmail.com`
- Contrasena: `m38rmF$`

## Comandos

```bash
npm install
npm run dev
```
