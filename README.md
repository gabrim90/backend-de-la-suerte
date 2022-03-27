- [Backend de la suerte](#backend-de-la-suerte)
  - [Capturas del frontend](#capturas-del-frontend)
    - [Login](#login)
    - [Itinerario](#itinerario)
    - [Final](#final)
  - [Estructura del Backend](#estructura-del-backend)
    - [Tablas](#tablas)
      - [Mineros](#mineros)
# Backend de la suerte
La idea para este segundo reto ha sido ir ampliando la aplicación que empecé en el reto 1. Ahora ya tenemos una aplicación más completa, pero con la idea de que siga siendo un **cliente tonto** y que todo el contenido y las decisiones principales vengan del backend. De tal forma que el flujo de las distintas 'pantallas' se gestiona desde el backend.

La idea es una aplicación muy simple, en la que te registras como un minero (usuario y contraseña en plano) y vas picando diferentes items y eligiendo un itinerario hasta que das con el codiciado oro 👑 . Cada nivel que 'picas' te lleva a descubrir nuevos items. Finalmente encuentras el oro y te muestra el itinierario que has escogido. 

## Capturas del frontend

### Login
Pantalla de login donde se registra el minero:
![Login](doc/imgs/frontend-itinerario.png)
### Itinerario
Cada capa del itinerario se muestra así
![Itinerario](doc/imgs/frontend-itinerario.png)
### Final
Pantalla de final donde se muestra la recompensa y el resumen del camino seguido:
![Login](doc/imgs/frontend-login.png)



 ## Estructura del Backend
Para este segundo reto he realizado ya un backend más completo con varias tablas y relaciones.

### Tablas

#### Mineros
Los mineros se registran en la tabla de mineros, la estructura es la siguiente:
