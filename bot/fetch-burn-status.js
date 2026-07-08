/**
 * fetch-burn-status.js
 * -------------------------------------------------------------
 * Lee el estado real del contrato de vesting/lock de Streamflow
 * que libera 2.000.000 de tokens/día hacia la wallet de quema,
 * y escribe un JSON (data/burn-status.json) que la web consulta
 * para mostrar el dashboard con datos reales en vez de datos de
 * ejemplo.
 *
 * Este script está pensado para ejecutarse solo, vía GitHub
 * Actions (ver .github/workflows/update-burn.yml), sin que nadie
 * tenga que tocarlo a mano.
 */

const fs = require("fs");
const path = require("path");
const config = require("./config.js");

const OUTPUT_PATH = path.join(__dirname, "..", "data", "burn-status.json");

async function main() {
  const isConfigured =
    config.CONTRACT_ID && config.CONTRACT_ID !== "PENDIENTE_DE_LANZAMIENTO";

  let statusData;

  if (!isConfigured) {
    statusData = buildDemoStatus();
    console.log(
      "⚠️  CONTRACT_ID no configurado todavía. Escribiendo datos de DEMO."
    );
  } else {
    try {
      statusData = await fetchRealStatus();
      console.log("✅ Datos reales leídos del contrato de Streamflow.");
    } catch (err) {
      console.error("❌ Error leyendo Streamflow:", err.message);
      if (fs.existsSync(OUTPUT_PATH)) {
        console.log("Conservando el último JSON válido guardado.");
        return;
      }
      statusData = buildDemoStatus();
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(statusData, null, 2));
  console.log("Escrito:", OUTPUT_PATH);
}

async function fetchRealStatus() {
  const { StreamflowSolana, getBN } = await import("@streamflow/stream");

  const client = new StreamflowSolana.SolanaStreamClient(config.RPC_URL);

  const contract = await client.getOne({ id: config.CONTRACT_ID });

  const decimals = config.TOKEN_DECIMALS ?? 6;

  const deposited = Number(contract.depositedAmount) / 10 ** decimals;
  const withdrawn = Number(contract.withdrawnAmount) / 10 ** decimals;

  const totalLocked = config.TOTAL_LOCKED;
  const burnedSoFar = withdrawn;
  const burnedPercentOfLock = (burnedSoFar / totalLocked) * 100;

  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = config.START_TS;
  const secondsPerDay = 86400;
  const dayNumber = Math.max(
    1,
    Math.min(config.TOTAL_DAYS, Math.floor((nowSec - startSec) / secondsPerDay) + 1)
  );

  const nextReleaseTs = startSec + dayNumber * secondsPerDay;

  return {
    mode: "real",
    updated_at: new Date().toISOString(),
    token_mint: config.TOKEN_MINT,
    contract_id: config.CONTRACT_ID,
    total_locked_for_burn: totalLocked,
    burned_so_far: Math.round(burnedSoFar),
    burned_percent: Number(burnedPercentOfLock.toFixed(2)),
    day_number: dayNumber,
    total_days: config.TOTAL_DAYS,
    next_release_at: new Date(nextReleaseTs * 1000).toISOString(),
    daily_burn_amount: config.DAILY_BURN_AMOUNT,
    explorer_links: {
      streamflow: `https://app.streamflow.finance/contract/solana/mainnet/${config.CONTRACT_ID}`,
      solscan_token: `https://solscan.io/account/${config.BURN_WALLET}`,
      rugcheck: `https://rugcheck.xyz/tokens/${config.TOKEN_MINT}`,
    },
  };
}

function buildDemoStatus() {
  return {
    mode: "demo",
    updated_at: new Date().toISOString(),
    note: "Datos de ejemplo: el bot automático (GitHub Actions) todavía no se ha desplegado",
    token_mint: "6P2QzQ6BGNx834ciHhmwQsL4Jq23LrecnASne8gWpump",
    contract_id: "DsrrWjhqVfPyY9D2QnmL1agNSsjm7MrwhKmvScGzoSWi",
    total_locked_for_burn: 252039030,
    burned_so_far: 0,
    burned_percent: 0,
    day_number: 1,
    total_days: 126,
    next_release_at: null,
    daily_burn_amount: 2000000,
    explorer_links: {
      streamflow: "https://app.streamflow.finance/contract/solana/mainnet/DsrrWjhqVfPyY9D2QnmL1agNSsjm7MrwhKmvScGzoSWi",
      solscan_token: "https://solscan.io/account/p27nVPfVv3oJfe7S97NePFWQcz3NvAypm8QqZjc1pBx",
      rugcheck: "https://rugcheck.xyz/tokens/6P2QzQ6BGNx834ciHhmwQsL4Jq23LrecnASne8gWpump",
    },
  };
}

main().catch((err) => {
  console.error("Fallo inesperado en fetch-burn-status.js:", err);
  process.exit(1);
});
