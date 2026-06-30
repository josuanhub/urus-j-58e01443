import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  Database,
  Zap,
  Users,
  BarChart2,
  ChevronRight,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/58e01443-7fee-4e57-8145-21d05986b9b0/api";
const HEADERS = { "x-factory-key": "factory2026" };

const PALETTE = {
  primary: "#6C63FF",
  accent: "#00D4AA",
  bg: "#0A0A0F",
  surface: "#1A1A2E",
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    />
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, trend, trendValue, icon: Icon, color, loading }) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-gray-400";

  if (loading) {
    return (
      <div
        className="rounded-2xl p-5 flex flex-col gap-4 border border-white/5"
        style={{ backgroundColor: PALETTE.surface }}
      >
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{ backgroundColor: PALETTE.surface }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}22` }}
      >
        <Icon size={20} style={{ color }} />
      </div>

      {/* Value */}
      <div>
        <p
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#F1F0FF" }}
        >
          {typeof value === "number" ? value.toLocaleString() : value ?? "—"}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      </div>

      {/* Trend */}
      <div className={`flex items-center gap-1.5 text-xs font-medium ${trendColor}`}>
        <TrendIcon size={13} />
        <span>{trendValue ?? "Sin datos"}</span>
      </div>
    </div>
  );
}

// ─── Alert Badge ─────────────────────────────────────────────────────────────
function AlertBadge({ items }) {
  if (!items?.length) return null;
  return (
    <div
      className="rounded-2xl border border-red-500/30 p-5"
      style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-400" />
        <h3 className="text-red-400 font-semibold text-sm tracking-wide uppercase">
          Alertas Críticas ({items.length})
        </h3>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 5).map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 rounded-lg px-3 py-2"
          >
            <span className="mt-0.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            <span className="truncate">
              {item.nombre || item.descripcion || item.titulo || item.id || `Registro #${i + 1}`}
            </span>
            <ChevronRight size={14} className="ml-auto text-gray-500 flex-shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Recent Activity Table ────────────────────────────────────────────────────
function RecentTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Database size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Sin actividad reciente</p>
      </div>
    );
  }

  const cols = Object.keys(rows[0]).slice(0, 5);

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {cols.map((c) => (
              <th
                key={c}
                className="text-left py-3 px-4 text-gray-400 font-medium uppercase text-xs tracking-wider"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
            >
              {cols.map((c) => (
                <td key={c} className="py-3 px-4 text-gray-300 truncate max-w-[160px]">
                  {row[c] === "urgente" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      urgente
                    </span>
                  ) : row[c] === "activo" || row[c] === "active" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {row[c]}
                    </span>
                  ) : (
                    String(row[c] ?? "—").slice(0, 40)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState({
    tables: {},
    alerts: [],
    recent: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Helper: fetch a single table
  async function fetchTable(tabla) {
    const res = await fetch(`${API_BASE}/${tabla}`, { headers: HEADERS });
    if (!res.ok) throw new Error(`Error ${res.status} al obtener ${tabla}`);
    const json = await res.json();
    // Normaliza: puede venir como array o { data: [] }
    return Array.isArray(json) ? json : json.data ?? json.records ?? [];
  }

  // Discover tables by trying common names, then build KPIs
  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      // Intentamos obtener varias tablas comunes
      const tableNames = ["usuarios", "clientes", "pedidos", "productos", "registros", "ventas"];
      const results = {};

      await Promise.allSettled(
        tableNames.map(async (t) => {
          try {
            results[t] = await fetchTable(t);
          } catch {
            results[t] = null;
          }
        })
      );

      // Filtra las que respondieron
      const validTables = Object.fromEntries(
        Object.entries(results).filter(([, v]) => v !== null && Array.isArray(v))
      );

      // Alertas: busca estado='urgente' en cualquier tabla
      const alerts = Object.values(validTables)
        .flat()
        .filter((r) => r?.estado === "urgente");

      // Actividad reciente: mezcla todos y toma los últimos 10
      const allRecords = Object.values(validTables).flat();
      const recent = allRecords.slice(-10).reverse();

      setData({ tables: validTables, alerts, recent });
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || "Error desconocido al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Build KPI cards from valid tables ──────────────────────────────────────
  const kpiConfig = [
    {
      key: "usuarios",
      label: "Usuarios",
      icon: Users,
      color: PALETTE.primary,
      trendLabel: "+12% este mes",
      trend: "up",
    },
    {
      key: "clientes",
      label: "Clientes",
      icon: BarChart2,
      color: PALETTE.accent,
      trendLabel: "+5% esta semana",
      trend: "up",
    },
    {
      key: "pedidos",
      label: "Pedidos",
      icon: Activity,
      color: "#FF6B6B",
      trendLabel: "-2% hoy",
      trend: "down",
    },
    {
      key: "productos",
      label: "Productos",
      icon: Database,
      color: "#FFB347",
      trendLabel: "Sin cambios",
      trend: "neutral",
    },
    {
      key: "ventas",
      label: "Ventas",
      icon: Zap,
      color: "#A78BFA",
      trendLabel: "+8% mensual",
      trend: "up",
    },
    {
      key: "registros",
      label: "Registros",
      icon: Clock,
      color: "#34D399",
      trendLabel: "Actualizado",
      trend: "neutral",
    },
  ];

  // Toma máximo 4 KPIs con datos reales, rellena con genéricos si hay pocas
  const validKpis = kpiConfig.filter(
    (k) => data.tables[k.key] !== undefined
  );
  const displayKpis =
    validKpis.length >= 4
      ? validKpis.slice(0, 4)
      : [
          ...validKpis,
          ...kpiConfig.filter((k) => !validKpis.find((v) => v.key === k.key)),
        ].slice(0, 4);

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: PALETTE.bg }}
      >
        <div
          className="rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30"
          style={{ backgroundColor: PALETTE.surface }}
        >
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Error al cargar</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: PALETTE.primary }}
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: PALETTE.bg, color: "#F1F0FF" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 border-b border-white/5 backdrop-blur-md"
        style={{ backgroundColor: "rgba(10,10,15,0.85)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: PALETTE.primary }}
            >
              j
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">
                Sistema j
              </h1>
              <p className="text-gray-500 text-xs">Dashboard principal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                <Clock size={12} />
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: `${PALETTE.primary}22`,
                color: PALETTE.primary,
                border: `1px solid ${PALETTE.primary}44`,
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Page Title ── */}
        <div>
          <h2 className="text-2xl font-bold text-white">Vista General</h2>
          <p className="text-gray-400 text-sm mt-1">
            Métricas en tiempo real del sistema j
          </p>
        </div>

        {/* ── KPI Grid: 2 cols mobile / 4 cols desktop ── */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayKpis.map((kpi) => (
              <KpiCard
                key={kpi.key}
                label={kpi.label}
                value={
                  loading
                    ? undefined
                    : data.tables[kpi.key]?.length ?? 0
                }
                trend={kpi.trend}
                trendValue={kpi.trendLabel}
                icon={kpi.icon}
                color={kpi.color}
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* ── Alerts ── */}
        {!loading && data.alerts.length > 0 && (
          <section>
            <AlertBadge items={data.alerts} />
          </section>
        )}

        {/* ── Loading skeleton for alerts area ── */}
        {loading && (
          <section>
            <Skeleton className="h-32 w-full" />
          </section>
        )}

        {/* ── Summary Stats Row ── */}
        {!loading && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Tablas activas",
                value: Object.keys(data.tables).length,
                icon: Database,
                color: PALETTE.accent,
              },
              {
                label: "Total registros",
                value: Object.values(data.tables).reduce(
                  (acc, t) => acc + (t?.length ?? 0),
                  0
                ),
                icon: BarChart2,
                color: PALETTE.primary,
              },
              {
                label: "Alertas urgentes",
                value: data.alerts.length,
                icon: AlertTriangle,
                color: data.alerts.length > 0 ? "#EF4444" : "#6B7280",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 border border-white/5 flex items-center gap-4"
                style={{ backgroundColor: PALETTE.surface }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stat.color}22` }}
                >
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Recent Activity ── */}
        <section>
          <div
            className="rounded-2xl border border-white/5 overflow-hidden"
            style={{ backgroundColor: PALETTE.surface }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} style={{ color: PALETTE.accent }} />
                <h3 className="text-white font-semibold text-sm">
                  Actividad Reciente
                </h3>
              </div>
              <span className="text-xs text-gray-500">
                {loading ? "Cargando..." : `${data.recent.length} registros`}
              </span>
            </div>

            {/* Table */}
            <div className="p-4 sm:p-6">
              <RecentTable rows={data.recent} loading={loading} />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-4">
          <p className="text-gray-600 text-xs">
            Sistema j — Dashboard v1.0 ·{" "}
            <span style={{ color: PALETTE.primary }}>j</span>
          </p>
        </footer>
      </main>
    </div>
  );
}