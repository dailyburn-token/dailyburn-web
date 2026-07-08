/**
 * config.js
 * -------------------------------------------------------------
 * Rellena estos valores DESPUÉS de:
 *   1) Lanzar $DBURN en pump.fun
 *   2) Crear el contrato de lock en Streamflow con los tokens
 *      destinados a quema
 *
 * Hasta que rellenes CONTRACT_ID, el bot escribirá datos de DEMO
 * automáticamente para que la web no se rompa.
 */
module.exports = {
  // RPC de Solana. El público funciona para pruebas, pero para uso
  // real conviene uno propio (Helius, QuickNode, etc. tienen plan
  // gratuito) porque el público limita peticiones.
  RPC_URL: "https://api.mainnet-beta.solana.com",
  // ID del contrato de Streamflow (te lo da su web al crear el lock)
  CONTRACT_ID: "DsrrWjhqVfPyY9D2QnmL1agNSsjm7MrwhKmvScGzoSWi",
  // Dirección del mint del token $DBURN (te la da pump.fun al crear el token)
  TOKEN_MINT: "6P2QzQ6BGNx834ciHhmwQsL4Jq23LrecnASne8gWpump",
  // Dirección de la wallet que recibe los tokens liberados para quemar
  // (campo "Recipient" del contrato en Streamflow)
  BURN_WALLET: "p27nVPfVv3oJfe7S97NePFWQcz3NvAypm8QqZjc1pBx",
  // Decimales del token (pump.fun usa 6 por defecto, confírmalo)
  TOKEN_DECIMALS: 6,
  // Cuántos tokens se depositaron en el contrato para quema
  TOTAL_LOCKED: 252039030,
  // Cuántos tokens se liberan cada día
  DAILY_BURN_AMOUNT: 2000000,
  // Duración total del plan de quema, en días
  TOTAL_DAYS: 126,
  // Timestamp UNIX (segundos) del inicio del contrato de lock
  // Puedes obtenerlo con: Math.floor(new Date("2026-08-01T00:00:00Z").getTime()/1000)
  START_TS: 1783331760,
};
