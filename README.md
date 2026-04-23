# Leb Torá · Sitio web

Sitio web comunitario de Leb Torá — un gmaj que pone a disposición paraguas, útiles escolares y medicinas para los Bajurim y Abrejim de Polanco, Ciudad de México.

## 🏗️ Stack

- **HTML/CSS/JavaScript** puros, sin frameworks
- **Leaflet + OpenStreetMap** para el mapa
- **Firebase Firestore** como backend (reutiliza el proyecto `paraguas-gemaj-leb-tora`)
- **Formspree** para el formulario de contacto
- **GitHub Pages** como hosting (gratis)

## 📁 Estructura

```
leb-tora-site/
├── index.html              Inicio
├── paraguas.html           Paraguas (con mapa en vivo)
├── utiles.html             Útiles escolares
├── medicinas.html          Medicinas
├── quienes-somos.html      Acerca
├── apoyar.html             Donaciones
├── contacto.html           Contacto con form
├── css/
│   └── styles.css          CSS único compartido
├── js/
│   ├── layout.js           Header + Footer compartido
│   ├── firebase.js         Config Firebase
│   └── map.js              Lógica del mapa
├── icons/                  Favicon e íconos PWA
├── images/
│   └── logo-leb-tora.png   Logo principal
├── CNAME                   Dominio personalizado
└── README.md
```

## 🚀 Setup

### 1. Subir a GitHub

```bash
# En tu compu, dentro de la carpeta leb-tora-site:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/leb-tora.git
git push -u origin main
```

### 2. Activar GitHub Pages

1. Ve a tu repositorio en github.com
2. Settings → Pages
3. Source: "Deploy from a branch" → Branch: `main` → `/ (root)` → Save
4. Espera 1-2 minutos
5. Tu sitio estará en `https://TU_USUARIO.github.io/leb-tora`

### 3. Conectar dominio `gmajbetdavid.com`

**En el archivo CNAME** (ya está creado) debe decir: `gmajbetdavid.com`

**En tu registrador de dominio** (donde compraste el dominio — Wix, GoDaddy, etc.):

Agrega estos registros DNS:
```
Tipo    Nombre    Valor
A       @         185.199.108.153
A       @         185.199.109.153
A       @         185.199.110.153
A       @         185.199.111.153
CNAME   www       TU_USUARIO.github.io
```

Después:
1. En GitHub: Settings → Pages → Custom domain: `gmajbetdavid.com`
2. Marca "Enforce HTTPS" (aparece tras unos minutos)

La propagación tarda 10 min a 48 h. Paciencia.

### 4. Configurar Formspree

1. Ve a https://formspree.io → Crea cuenta gratis
2. Crea un formulario nuevo con destino `gmajbetdavid@gmail.com`
3. Confirma el email desde tu bandeja
4. Copia el endpoint (ej: `https://formspree.io/f/abc123xyz`)
5. Abre `contacto.html` y reemplaza `TU_ID_DE_FORMSPREE` con ese endpoint

### 5. Configurar el botón "Donar"

En `apoyar.html`, el botón `Donar ahora` tiene `href="#donar"` temporalmente. Reemplázalo por el link real de tu sistema de donaciones.

## 🗺️ Sobre el mapa

El mapa en `paraguas.html` se conecta **en tiempo real** con el proyecto Firebase `paraguas-gemaj-leb-tora`. Las estaciones que agregas desde el admin (https://paraguas-gemaj-leb-tora.web.app/admin) aparecen automáticamente aquí.

## ✏️ Editar contenido

- **Textos**: abre el `.html` correspondiente y edita directamente
- **Colores**: `css/styles.css` → variables `--ink`, `--blue`, etc. al inicio
- **Menú**: `js/layout.js` → array `navItems`
- **Footer**: `js/layout.js` → función que genera `#site-footer`

## 🔄 Publicar cambios

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

GitHub Pages se actualiza solo en ~1 minuto.

## 📧 Dudas

gmajbetdavid@gmail.com
