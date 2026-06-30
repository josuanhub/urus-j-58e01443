import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  RefreshCw,
  Database,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/58e01443-7fee-4e57-8145-21d05986b9b0/api";
const TABLA = "configuracion";
const HEADERS = { "x-factory-key": "factory2026", "Content-Type": "application/json" };
const PAGE_SIZE = 20;

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#1A1A2E] border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-[#1A1A2E] border-red-500/40 text-red-400"
          }`}
        >
          {t.type === "success" ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded-md bg-white/5 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ open, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Eliminar registro</h3>
            <p className="text-white/50 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2 transition-colors"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function FormModal({ open, onClose, onSave, editData, fields, loading }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(editData ? { ...editData } : {});
      setErrors({});
    }
  }, [open, editData]);

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      if (f.required && !form[f.key]?.toString().trim()) e[f.key] = "Campo requerido";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) onSave(form);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={16} className="text-[#6C63FF]" />
            </div>
            <h2 className="text-white font-semibold">{editData ? "Editar registro" : "Nuevo registro"}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                  {f.label} {f.required && <span className="text-[#6C63FF]">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={`w-full bg-black/30 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors[f.key] ? "border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:ring-[#6C63FF]/40 focus:border-[#6C63FF]/40"
                    }`}
                    placeholder={f.placeholder || ""}
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={`w-full bg-black/30 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-colors ${
                      errors[f.key] ? "border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:ring-[#6C63FF]/40 focus:border-[#6C63FF]/40"
                    }`}
                    placeholder={f.placeholder || ""}
                  />
                )}
                {errors[f.key] && <p className="mt-1 text-xs text-red-400">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#6C63FF]/20"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {editData ? "Guardar cambios" : "Crear registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toasts, add: addToast, remove: removeToast } = useToast();

  // Inferir campos desde los datos
  const inferFields = (items) => {
    if (!items.length) return { fields: [], columns: [] };
    const sample = items[0];
    const skip = ["id", "_id", "createdAt", "updatedAt", "__v"];
    const keys = Object.keys(sample).filter((k) => !skip.includes(k));
    const cols = keys.slice(0, 5); // mostrar máx 5 cols en tabla
    const fs = keys.map((k) => ({
      key: k,
      label: k.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim(),
      type: typeof sample[k] === "number" ? "number" : k.toLowerCase().includes("email") ? "email" : k.toLowerCase().includes("descripcion") || k.toLowerCase().includes("descripción") || k.toLowerCase().includes("notas") ? "textarea" : "text",
      required: ["nombre", "name", "titulo", "title", "clave", "key"].includes(k.toLowerCase()),
      placeholder: `Ingrese ${k.replace(/_/g, " ").toLowerCase()}`,
    }));
    return { fields: fs, columns: cols };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, {
        headers: { "x-factory-key": "factory2026" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json) ? json : json.data || json.items || json.results || [];
      setData(items);
      setFiltered(items);
      const inf = inferFields(items);
      setFields(inf.fields);
      setColumns(inf.columns);
    } catch (err) {
      addToast("Error al cargar los datos: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Búsqueda
  useEffect(() => {
    const q = search.toLowerCase();
    const f = data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Crear / Editar
  const handleSave = async (form) => {
    setSaving(true);
    try {
      const isEdit = !!editData;
      const id = editData?.id || editData?._id;
      const url = isEdit ? `${API_BASE}/${TABLA}/${id}` : `${API_BASE}/${TABLA}`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      addToast(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente");
      setModalOpen(false);
      setEditData(null);
      await fetchData();
    } catch (err) {
      addToast("Error al guardar: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}/${confirmId}`, {
        method: "DELETE",
        headers: { "x-factory-key": "factory2026" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      addToast("Registro eliminado correctamente");
      setConfirmId(null);
      await fetchData();
    } catch (err) {
      addToast("Error al eliminar: " + err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const openNew = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (row) => { setEditData(row); setModalOpen(true); };
  const getRowId = (row) => row.id || row._id;

  const displayColumns = columns.length ? columns : ["Cargando..."];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmModal
        open={!!confirmId}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
      <FormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
        fields={fields}
        loading={saving}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={20} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configuración del sistema</h1>
              <p className="text-white/40 text-sm">Sistema j · Gestión de configuraciones</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar en configuraciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40 focus:border-[#6C63FF]/40 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-[#1A1A2E] border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
              title="Recargar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-medium transition-colors shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={16} />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        {!loading && (
          <div className="flex items-center gap-4 mb-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Database size={12} />
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
              {search && ` (filtrado de ${data.length})`}
            </span>
            {filtered.length > PAGE_SIZE && (
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal size={12} />
                Página {page} de {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  {displayColumns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider"
                    >
                      {col.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} cols={displayColumns.length} />
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={displayColumns.length + 1} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Settings size={28} className="text-white/20" />
                        </div>
                        <div>
                          <p className="text-white/50 font-medium">
                            {search ? "Sin resultados para tu búsqueda" : "No hay configuraciones aún"}
                          </p>
                          <p className="text-white/30 text-xs mt-1">
                            {search ? "Intenta con otro término" : "Crea tu primera configuración"}
                          </p>
                        </div>
                        {!search && (
                          <button
                            onClick={openNew}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-medium transition-colors"
                          >
                            <Plus size={14} />
                            Nueva configuración
                          </button>
                        )}
                      </div>
                    </td>