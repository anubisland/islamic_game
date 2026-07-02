import { useRef } from "react";
import type { GameProgress } from "../types";
import { Header } from "../components/Header";
import { useTranslation } from "../i18n";

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onBack: () => void;
  progress?: GameProgress;
  onImportProgress?: (data: GameProgress) => void;
}

export function SettingsPage({ soundEnabled, onToggleSound, onReset, onBack, progress, onImportProgress }: Props) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const s = t.settings;

  function handleReset() {
    if (window.confirm(t.home.resetConfirm)) {
      onReset();
      onBack();
    }
  }

  function handleExport() {
    if (!progress) return;
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `islamic-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onImportProgress) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as GameProgress;
        if (!data.stages || typeof data.stages !== "object") throw Error();
        onImportProgress(data);
        alert(s.importSuccess);
      } catch {
        alert(s.importError);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div>
      <Header onHome={onBack} title={s.title} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.6rem" }}>
        <div
          className="animate-fade-in-up"
          style={{
            background: "var(--card-bg)",
            borderRadius: "var(--radius)",
            padding: "1.25rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "var(--green-primary)",
              fontSize: "1.15rem",
              marginBottom: "1.5rem",
            }}
          >
            ⚙️ {s.title}
          </h2>

          <div style={sectionStyle}>
            <div style={rowStyle}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.sound}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                  {s.soundDesc}
                </div>
              </div>
              <button
                onClick={onToggleSound}
                style={{
                  ...toggleBtn,
                  background: soundEnabled ? "var(--green-light)" : "#ccc",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transform: soundEnabled ? "translateX(0)" : "translateX(-16px)",
                    transition: "transform 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          </div>

          <div style={{ ...sectionStyle, borderTop: "none" }}>
            <div style={rowStyle}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.reset}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                  {s.resetDesc}
                </div>
              </div>
              <button
                onClick={handleReset}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 8,
                  background: "#e74c3c",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {s.resetBtn}
              </button>
            </div>
          </div>

          {progress && (
            <>
              <div style={{ ...sectionStyle, borderTop: "none" }}>
                <div style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.export}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                      {s.exportDesc}
                    </div>
                  </div>
                  <button onClick={handleExport} style={actionBtn}>
                    {s.exportBtn}
                  </button>
                </div>
              </div>

              <div style={{ ...sectionStyle, borderTop: "none" }}>
                <div style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.import}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                      {s.importDesc}
                    </div>
                  </div>
                  <button onClick={() => fileRef.current?.click()} style={actionBtn}>
                    {s.importBtn}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={handleImport}
                  />
                </div>
              </div>
            </>
          )}

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "var(--bg)",
              borderRadius: 10,
              textAlign: "center",
              fontSize: "0.8rem",
              color: "var(--text-light)",
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>🕌</div>
            <strong style={{ color: "var(--green-primary)" }}>{t.home.title}</strong>
            <br />
            {s.version} 0.3.0
            <br />
            {s.info}
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  padding: "0.75rem 0",
  borderTop: "1px solid var(--border)",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
};

const actionBtn: React.CSSProperties = {
  padding: "0.4rem 1rem",
  borderRadius: 8,
  background: "var(--green-light)",
  color: "#fff",
  fontSize: "0.82rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const toggleBtn: React.CSSProperties = {
  width: 44,
  height: 24,
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  padding: "2px",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  transition: "background 0.2s",
};
