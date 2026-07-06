# DAILYBURN ($DBURN) — web + bot de quema automática

Este paquete contiene:

- `index.html` — la web pública, con el dashboard de quema
- `bot/` — el script que lee el contrato de Streamflow
- `data/burn-status.json` — el JSON que la web consulta (lo genera el bot)
- `.github/workflows/update-burn.yml` — hace que el bot se ejecute solo, cada hora, para siempre, gratis

## Cómo se conecta todo

```
Streamflow (contrato real)
        ↓
bot/fetch-burn-status.js   (lo ejecuta GitHub Actions cada hora)
        ↓
data/burn-status.json      (se actualiza y se sube solo al repo)
        ↓
index.html                 (lo lee con fetch() y actualiza el dashboard)
```

Mientras `bot/config.js` no tenga el contrato real, la web muestra
datos de ejemplo (modo "demo") de forma automática, para que nunca
se rompa ni se quede vacía.

## Puesta en marcha, paso a paso

### 1. Sube esto a GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo, público, por ejemplo `dailyburn-web`.
3. Sube todos los archivos de esta carpeta a ese repositorio (puedes
   arrastrarlos directamente en la web de GitHub, en "Add file" →
   "Upload files", sin necesidad de usar la terminal).

### 2. Activa GitHub Pages (para que la web sea pública, gratis)

1. En tu repositorio, ve a **Settings → Pages**.
2. En "Source", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. En un par de minutos tu web estará en:
   `https://TU-USUARIO.github.io/dailyburn-web/`

### 3. Cuando lances el token de verdad

1. Compra tu dev buy en pump.fun → apunta la dirección del **mint** del token.
2. Crea el contrato de lock en [Streamflow](https://app.streamflow.finance)
   con los tokens destinados a quema (1.000.000/día, no cancelable) →
   apunta el **ID del contrato**.
3. Edita `bot/config.js` en GitHub (puedes hacerlo directamente en la
   web, botón del lápiz) y rellena:
   - `CONTRACT_ID`
   - `TOKEN_MINT`
   - `TOTAL_LOCKED`
   - `START_TS` (usa el cálculo que se indica en el propio archivo)
4. Guarda los cambios (commit). El workflow se ejecutará solo en la
   siguiente hora en punto, o puedes forzarlo ya desde la pestaña
   **Actions** de tu repositorio → selecciona el workflow → **Run workflow**.

### 4. Verifica que funciona

- Ve a la pestaña **Actions** de tu repo: deberías ver el workflow
  ejecutándose en verde cada hora.
- Abre `data/burn-status.json` en el repo: debería tener `"mode": "real"`
  y los números actualizados.
- Abre tu web: el dashboard debería mostrar esos datos reales.

## Notas importantes

- **El SDK de Streamflow puede cambiar.** Antes del lanzamiento real,
  revisa `bot/fetch-burn-status.js` contra la documentación actual en
  https://docs.streamflow.finance/ — los nombres de campos exactos del
  contrato pueden variar entre versiones del paquete.
- **RPC público con límites**: si el bot empieza a fallar por
  demasiadas peticiones, cambia `RPC_URL` en `config.js` por uno de
  un proveedor gratuito como Helius o QuickNode.
- **Nada de esto publica en Twitter/X automáticamente** (se decidió
  no automatizarlo porque la API de pago de X no compensaba con este
  presupuesto). Comparte tú mismo el enlace a la web cuando quieras
  anunciar una quema.
