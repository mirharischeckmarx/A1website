"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GRID = 22;
const CELL = 22;

type Vec = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";

const DIR_VEC: Record<Dir, Vec> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };

function randCell(exclude: Vec[]): Vec {
  while (true) {
    const c = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!exclude.some((e) => e.x === c.x && e.y === c.y)) return c;
  }
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }] as Vec[],
    dir: "R" as Dir,
    nextDir: "R" as Dir,
    food: { x: 15, y: 10 } as Vec,
    alive: true,
  });

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("a1-snake-best") || "0", 10);
    if (!Number.isNaN(stored)) setBest(stored);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "U", w: "U", W: "U",
        ArrowDown: "D", s: "D", S: "D",
        ArrowLeft: "L", a: "L", A: "L",
        ArrowRight: "R", d: "R", D: "R",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        if (OPPOSITE[next] !== stateRef.current.dir) {
          stateRef.current.nextDir = next;
        }
      }
      if (e.key === " " && !stateRef.current.alive) reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((t) => t + 1), 110);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const s = stateRef.current;
    if (!s.alive) return;
    s.dir = s.nextDir;
    const v = DIR_VEC[s.dir];
    const head = { x: s.snake[0].x + v.x, y: s.snake[0].y + v.y };

    if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
      s.alive = false;
      setRunning(false);
      return;
    }
    if (s.snake.some((p) => p.x === head.x && p.y === head.y)) {
      s.alive = false;
      setRunning(false);
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    const newSnake = [head, ...s.snake];
    if (!ate) newSnake.pop();
    s.snake = newSnake;
    if (ate) {
      s.food = randCell(newSnake);
      setScore((sc) => {
        const next = sc + 1;
        setBest((b) => {
          const nb = Math.max(b, next);
          localStorage.setItem("a1-snake-best", String(nb));
          return nb;
        });
        return next;
      });
    }

    draw();
  }, [tick]);

  function reset() {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      dir: "R",
      nextDir: "R",
      food: { x: 15, y: 10 },
      alive: true,
    };
    setScore(0);
    setRunning(true);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = GRID * CELL;
    const H = GRID * CELL;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(161,0,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(W, i * CELL);
      ctx.stroke();
    }

    const s = stateRef.current;
    ctx.fillStyle = "#ff3030";
    ctx.shadowColor = "rgba(255,48,48,0.7)";
    ctx.shadowBlur = 10;
    ctx.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;

    s.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "#fff" : `rgba(161,0,255,${1 - i / (s.snake.length + 4)})`;
      if (i === 0) {
        ctx.shadowColor = "rgba(161,0,255,0.6)";
        ctx.shadowBlur = 8;
      }
      ctx.fillRect(p.x * CELL + 2, p.y * CELL + 2, CELL - 4, CELL - 4);
      if (i === 0) ctx.shadowBlur = 0;
    });
  }

  useEffect(() => { draw(); }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}>
      <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
        <div style={{ color: "#A100FF", fontSize: 11, letterSpacing: 6, marginBottom: 12 }}>ERROR · 404</div>
        <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 700, letterSpacing: -1, margin: 0 }}>
          Page not found.
        </h1>
        <p style={{ color: "#A2A2A0", fontSize: 14, marginTop: 8, marginBottom: 28 }}>
          But there's a hacker loose on this page. <span style={{ color: "#fff" }}>Catch them.</span>
          <br />
          Arrow keys or WASD. Space to restart.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 12, color: "#fff", fontSize: 13, letterSpacing: 2 }}>
          <span>SCORE <span style={{ color: "#A100FF", fontWeight: 700 }}>{score}</span></span>
          <span>BEST  <span style={{ color: "#A100FF", fontWeight: 700 }}>{best}</span></span>
          {!running && <span style={{ color: "#ff3030", fontWeight: 700 }}>GAME OVER</span>}
        </div>

        <div style={{ display: "inline-block", border: "1px solid rgba(161,0,255,0.3)", borderRadius: 8, padding: 6, background: "#000" }}>
          <canvas
            ref={canvasRef}
            width={GRID * CELL}
            height={GRID * CELL}
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          {!running ? (
            <button
              onClick={reset}
              style={{
                background: "#A100FF", color: "#fff", border: "none",
                padding: "12px 28px", fontSize: 13, fontWeight: 600, letterSpacing: 2,
                cursor: "pointer", borderRadius: 4, fontFamily: "inherit",
              }}
            >
              RESTART
            </button>
          ) : null}
          <Link href="/" style={{ marginLeft: 12, color: "#A2A2A0", fontSize: 13, letterSpacing: 1, textDecoration: "none", borderBottom: "1px solid #333", paddingBottom: 2 }}>
            ← back to safety
          </Link>
        </div>
      </div>
    </div>
  );
}
