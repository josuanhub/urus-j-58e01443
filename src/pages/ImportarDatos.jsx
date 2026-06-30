import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Database,
  Rows,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/58e01443-7fee-4e57-8145-21d05986b9b0/upload-data";

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

function getFileIcon(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    return <FileSpreadsheet className="w-8 h-8" style={{ color: "#00D4AA" }} />;
  }
  if (name.endsWith(".pdf")) {
    return <FileText className="w-8 h-8 text-red-400" />;
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return <Image className="w-8 h-8 text-blue-400" />;
  }
  return <File className="w-8 h-8 text-gray-400" />;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isValidFile(file) {
  return ACCEPTED_MIME.includes(file.type) || ACCEPTED_TYPES.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);
  const xhrRef = useRef(null);

  const handleFilePick = useCallback((file) => {
    setFileError("");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
    if (!file) return;
    if (!isValidFile(file)) {
      setFileError(
        `Tipo no permitido: "${file.name}". Acepta: ${ACCEPTED_TYPES.join(", ")}`
      );
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
  }, []);

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFilePick(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFilePick(file);
    e.target.value = "";
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("POST", UPLOAD_URL);
    xhr.setRequestHeader("x-factory-key", "factory2026");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      setProgress(100);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setResult(data);
          setStatus("success");
        } else {
          setErrorMsg(
            data?.message ||
              data?.error ||
              `Error del servidor (${xhr.status})`
          );
          setStatus("error");
        }
      } catch {
        if (xhr.status >= 200 && xhr.status < 300) {
          setResult({ mensaje: "Archivo procesado correctamente." });
          setStatus("success");
        } else {
          setErrorMsg(`Error del servidor (${xhr.status})`);
          setStatus("error");
        }
      }
    };

    xhr.onerror = () => {
      setErrorMsg("Error de red. Verifica tu conexión e intenta de nuevo.");
      setStatus("error");
    };

    xhr.onabort = () => {
      setStatus("idle");
      setProgress(0);
    };

    xhr.send(formData);
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  };

  const handleClear = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setFileError("");
    setDragOver(false);
  };

  const isDragging = dragOver;
  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-10"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#6C63FF22" }}
          >
            <Upload className="w-6 h-6" style={{ color: "#6C63FF" }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "#F0F0FF" }}
          >
            Importar Datos
          </h1>
        </div>
        <p className="text-sm ml-14" style={{ color: "#8080A0" }}>
          Sube archivos .xlsx, .xls, .csv, .pdf, .png o .jpg al sistema{" "}
          <span style={{ color: "#6C63FF" }}>j</span>
        </p>
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
        style={{
          backgroundColor: "#1A1A2E",
          border: "1px solid #2A2A4E",
        }}
      >
        {/* Drop Zone */}
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer select-none transition-all duration-200"
          style={{
            minHeight: "200px",
            border: isDragging
              ? "2px dashed #6C63FF"
              : isSuccess
              ? "2px dashed #00D4AA"
              : isError
              ? "2px dashed #F87171"
              : "2px dashed #3A3A5E",
            backgroundColor: isDragging
              ? "#6C63FF12"
              : isSuccess
              ? "#00D4AA08"
              : isError
              ? "#F8717108"
              : "#0F0F1E",
            cursor: isUploading ? "not-allowed" : "pointer",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={onInputChange}
            disabled={isUploading}
          />

          {/* Animated ring on drag */}
          {isDragging && (
            <div
              className="absolute inset-0 rounded-xl animate-pulse"
              style={{ backgroundColor: "#6C63FF08" }}
            />
          )}

          <div className="flex flex-col items-center gap-3 p-6 text-center z-10">
            <div
              className="p-4 rounded-full transition-all duration-200"
              style={{
                backgroundColor: isDragging
                  ? "#6C63FF30"
                  : isSuccess
                  ? "#00D4AA20"
                  : isError
                  ? "#F8717120"
                  : "#1E1E3E",
              }}
            >
              {isSuccess ? (
                <CheckCircle className="w-10 h-10" style={{ color: "#00D4AA" }} />
              ) : isError ? (
                <XCircle className="w-10 h-10 text-red-400" />
              ) : (
                <Upload
                  className={`w-10 h-10 transition-all duration-200 ${
                    isDragging ? "scale-110" : ""
                  }`}
                  style={{ color: isDragging ? "#6C63FF" : "#8080A0" }}
                />
              )}
            </div>

            {isDragging ? (
              <p className="font-semibold text-lg" style={{ color: "#6C63FF" }}>
                Suelta el archivo aquí
              </p>
            ) : isUploading ? (
              <p className="font-semibold text-lg" style={{ color: "#00D4AA" }}>
                Subiendo archivo…
              </p>
            ) : isSuccess ? (
              <p className="font-semibold text-lg" style={{ color: "#00D4AA" }}>
                ¡Archivo procesado!
              </p>
            ) : isError ? (
              <p className="font-semibold text-lg text-red-400">
                Error al procesar
              </p>
            ) : (
              <>
                <p
                  className="font-semibold text-base sm:text-lg"
                  style={{ color: "#C8C8E8" }}
                >
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-sm" style={{ color: "#6060A0" }}>
                  o{" "}
                  <span
                    className="underline underline-offset-2"
                    style={{ color: "#6C63FF" }}
                  >
                    selecciona desde tu equipo
                  </span>
                </p>
                <p className="text-xs mt-1" style={{ color: "#4A4A6A" }}>
                  {ACCEPTED_TYPES.join(" · ")}
                </p>
              </>
            )}
          </div>
        </div>

        {/* File error */}
        {fileError && (
          <div className="flex items-start gap-2 rounded-lg px-4 py-3 bg-red-900/20 border border-red-700/40">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{fileError}</p>
          </div>
        )}

        {/* File preview card */}
        {selectedFile && (
          <div
            className="flex items-center gap-4 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "#12122A",
              border: "1px solid #2A2A4E",
            }}
          >
            <div className="shrink-0">{getFileIcon(selectedFile)}</div>
            <div className="flex-1 min-w-0">
              <p
                className="font-medium text-sm truncate"
                style={{ color: "#D0D0F0" }}
              >
                {selectedFile.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6060A0" }}>
                {formatSize(selectedFile.size)}
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-900/30"
                title="Quitar archivo"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>
        )}

        {/* Progress bar */}
        {isUploading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium" style={{ color: "#8080A0" }}>
                Progreso de carga
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: "#6C63FF" }}
              >
                {progress}%
              </span>
            </div>
            <div
              className="w-full h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "#0A0A1F" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #6C63FF, #00D4AA)",
                  boxShadow: "0 0 8px #6C63FF88",
                }}
              />
            </div>
          </div>
        )}

        {/* Result panel */}
        {isSuccess && result && (
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              backgroundColor: "#00D4AA0D",
              border: "1px solid #00D4AA30",
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: "#00D4AA" }} />
              <span
                className="font-semibold text-sm"
                style={{ color: "#00D4AA" }}
              >
                Importación exitosa
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: "#0A0A1F" }}
                >
                  <Rows className="w-4 h-4 shrink-0" style={{ color: "#6C63FF" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#6060A0" }}>
                      Filas insertadas
                    </p>
                    <p
                      className="font-bold text-base tabular-nums"
                      style={{ color: "#D0D0F0" }}
                    >
                      {result.filas_insertadas}
                    </p>
                  </div>
                </div>
              )}
              {result.tabla && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: "#0A0A1F" }}
                >
                  <Database className="w-4 h-4 shrink-0" style={{ color: "#6C63FF" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#6060A0" }}>
                      Tabla destino
                    </p>
                    <p
                      className="font-bold text-sm truncate"
                      style={{ color: "#D0D0F0" }}
                    >
                      {result.tabla}
                    </p>
                  </div>
                </div>
              )}
              {result.errores !== undefined && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: "#0A0A1F" }}
                >
                  <AlertCircle
                    className="w-4 h-4 shrink-0"
                    style={{
                      color: result.errores > 0 ? "#F87171" : "#00D4AA",
                    }}
                  />
                  <div>
                    <p className="text-xs" style={{ color: "#6060A0" }}>
                      Errores
                    </p>
                    <p
                      className="font-bold text-base tabular-nums"
                      style={{
                        color: result.errores > 0 ? "#F87171" : "#00D4AA",
                      }}
                    >
                      {result.errores}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Extra fields */}
            {Object.entries(result)
              .filter(
                ([k]) =>
                  !["filas_insertadas", "tabla", "errores"].includes(k)
              )
              .map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm">
                  <span
                    className="font-medium capitalize"
                    style={{ color: "#8080A0" }}
                  >
                    {k.replace(/_/g, " ")}:
                  </span>
                  <span style={{ color: "#C0C0E0" }}>
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Error panel */}
        {isError && errorMsg && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              backgroundColor: "#F871710D",
              border: "1px solid #F8717130",
            }}
          >
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-red-400 mb-1">
                Error en la importación
              </p>
              <p className="text-sm" style={{ color: "#D0A0A0" }}>
                {errorMsg}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isUploading ? (
            <>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    !selectedFile
                      ? "#3A3A5E"
                      : "linear-gradient(135deg, #6C63FF, #5A52E8)",
                  color: "#FFFFFF",
                  boxShadow:
                    selectedFile ? "0 0 16px #6C63FF44" : "none",
                }}
              >
                <Upload className="w-4 h-4" />
                {isSuccess ? "Subir otro" : "Subir archivo"}
              </button>
              {(selectedFile || isSuccess || isError) && (
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: "#1E1E3E",
                    color: "#8080A0",
                    border: "1px solid #2A2A4E",
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: "#2A1A1A",
                color: "#F87171",
                border: "1px solid #5A2A2A",
              }}
            >
              <XCircle className="w-4 h-4" />
              Cancelar carga
            </button>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-xs text-center" style={{ color: "#3A3A5E" }}>
          Los datos se importan directamente al sistema{" "}
          <span style={{ color: "#6C63FF55" }}>j</span> · Máx. recomendado 50
          MB
        </p>
      </div>
    </div>
  );
}