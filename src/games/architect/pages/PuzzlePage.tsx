import type { CSSProperties } from "react";
import type { ArchitectStage } from "../data/stages";
import { useTranslation } from "../../../i18n";
import { TilePuzzle } from "../components/TilePuzzle";
import { FillPuzzle } from "../components/FillPuzzle";
import { SymmetryPuzzle } from "../components/SymmetryPuzzle";
import { ArchBalancePuzzle } from "../components/ArchBalancePuzzle";
import { PatternMatrixPuzzle } from "../components/PatternMatrixPuzzle";
import { TransformationPuzzle } from "../components/TransformationPuzzle";
import { MosaicPuzzle } from "../components/MosaicPuzzle";

interface Props {
  stage: ArchitectStage;
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function PuzzlePage({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();

  if (stage.puzzleType === "tesselation" && stage.tiles && stage.tileSlots) {
    return (
      <div>
        <header style={headerStyle}>
          <div style={headerInner}>
            <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
            <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
            <span />
          </div>
        </header>
        <TilePuzzle
          title={`${stage.icon} ${stage.title}`}
          subtitle={stage.subtitle}
          pieces={stage.tiles}
          slots={stage.tileSlots}
          info={stage.info}
          onComplete={() => onComplete(stage.id, 3, 0)}
        />
      </div>
    );
  }

  if (stage.puzzleType === "fill") {
    return (
      <FillPuzzle
        stage={{
          ...stage,
          gridSize: stage.gridSize ?? 6,
          pattern: stage.pattern!,
          palette: stage.palette!,
          hints: stage.hints ?? 3,
        }}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (stage.puzzleType === "archbalance") {
    return (
      <ArchBalancePuzzle
        stage={{
          ...stage,
          arches: stage.arches!,
          leftLabel: stage.leftLabel ?? "",
          rightLabel: stage.rightLabel ?? "",
        }}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (stage.puzzleType === "patternmatrix") {
    return (
      <PatternMatrixPuzzle
        stage={{
          ...stage,
          rounds: stage.rounds!,
        }}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (stage.puzzleType === "transform") {
    return (
      <TransformationPuzzle
        stage={{
          ...stage,
          transformRounds: stage.transformRounds!,
          palette: stage.palette!,
        }}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  if (stage.puzzleType === "mosaic") {
    return (
      <MosaicPuzzle
        stage={{
          ...stage,
          mosaicData: stage.mosaicData!,
          palette: stage.palette!,
        }}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  return <SymmetryPuzzle stage={stage} onComplete={onComplete} onBack={onBack} />;
}

const headerStyle: CSSProperties = {
  background: "linear-gradient(135deg, #1a237e, #283593)", color: "#fff", padding: "0.5rem 0.75rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: CSSProperties = { maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" };

const backBtn: CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", padding: "0.35rem 0.85rem", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)",
};
