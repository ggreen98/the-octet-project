"use client";

import { useState } from "react";

type QuestionType = "mc" | "tf" | "fib";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correct: string;
  acceptedAnswers?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: "mc",
    question: "What determines which element an atom is?",
    options: [
      "The number of neutrons in its nucleus",
      "The number of protons in its nucleus",
      "The number of electrons in its outer shell",
      "The total mass of the atom",
    ],
    correct: "The number of protons in its nucleus",
  },
  {
    id: 2,
    type: "mc",
    question: "What electric charge does a proton carry?",
    options: ["−1", "0", "+1", "+2"],
    correct: "+1",
  },
  {
    id: 3,
    type: "tf",
    question: "Electrons are heavier than protons.",
    correct: "false",
  },
  {
    id: 4,
    type: "mc",
    question: "Where are electrons found in an atom?",
    options: [
      "Inside the nucleus alongside protons and neutrons",
      "Randomly distributed throughout the atom",
      "In orbital shells surrounding the nucleus",
      "Attached directly to neutrons",
    ],
    correct: "In orbital shells surrounding the nucleus",
  },
  {
    id: 5,
    type: "fib",
    question: "Atoms of the same element with different numbers of neutrons are called ___.",
    correct: "isotopes",
    acceptedAnswers: ["isotope", "an isotope"],
  },
  {
    id: 6,
    type: "mc",
    question: "What force holds the nucleus together despite protons repelling each other?",
    options: [
      "Gravity",
      "The electromagnetic force",
      "The strong nuclear force",
      "The weak nuclear force",
    ],
    correct: "The strong nuclear force",
  },
  {
    id: 7,
    type: "tf",
    question: "Elements in the same column (group) of the periodic table share similar chemical properties.",
    correct: "true",
  },
  {
    id: 8,
    type: "mc",
    question: "What does the atomic mass of an element represent?",
    options: [
      "The number of protons in the nucleus",
      "The number of protons plus neutrons in a single atom",
      "A weighted average of all naturally occurring isotopes",
      "The mass of a single proton",
    ],
    correct: "A weighted average of all naturally occurring isotopes",
  },
  {
    id: 9,
    type: "fib",
    question: "The number of protons in an atom's nucleus is called its ___.",
    correct: "atomic number",
    acceptedAnswers: ["the atomic number"],
  },
  {
    id: 10,
    type: "mc",
    question: "What is an ion?",
    options: [
      "A type of neutron with no charge",
      "An atom that has gained or lost electrons",
      "An atom with no electrons at all",
      "A molecule made of two identical atoms",
    ],
    correct: "An atom that has gained or lost electrons",
  },
  {
    id: 11,
    type: "tf",
    question: "Neutrons carry a positive electric charge.",
    correct: "false",
  },
  {
    id: 12,
    type: "mc",
    question: "Carbon is the 6th element on the periodic table. Assuming it has no isotopes, how many neutrons does it have?",
    options: ["4", "6", "8", "12"],
    correct: "6",
  },
  {
    id: 13,
    type: "fib",
    question: "Group 17 elements — such as fluorine and chlorine — are called ___.",
    correct: "halogens",
    acceptedAnswers: ["halogen", "the halogens"],
  },
  {
    id: 14,
    type: "mc",
    question: "If a neutral sodium atom loses one electron, what does it become?",
    options: [
      "A neutron",
      "A different element",
      "A negatively charged ion",
      "A positively charged ion",
    ],
    correct: "A positively charged ion",
  },
  {
    id: 15,
    type: "mc",
    question: "Carbon is the 6th element on the periodic table. What is its approximate atomic mass?",
    options: ["6", "8", "12", "15"],
    correct: "12",
  },
];

function checkAnswer(question: Question, answer: string): boolean {
  const norm = answer.toLowerCase().trim();
  if (norm === question.correct.toLowerCase().trim()) return true;
  return (question.acceptedAnswers ?? []).some(
    (a) => a.toLowerCase().trim() === norm
  );
}

const LABEL_CORRECT = "rgba(80,200,120,0.15)";
const LABEL_WRONG   = "rgba(220,60,60,0.12)";
const BORDER_CORRECT = "rgba(80,200,120,0.6)";
const BORDER_WRONG   = "rgba(220,60,60,0.5)";

export function ChemistryQuiz() {
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<Record<number, string>>({});
  const [fibInput, setFibInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const q      = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;

  const currentAnswer = q.type === "fib" ? fibInput : answers[q.id];
  const hasAnswer = currentAnswer !== undefined && String(currentAnswer).trim() !== "";

  function selectOption(option: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  }

  function advance() {
    const finalAnswers =
      q.type === "fib"
        ? { ...answers, [q.id]: fibInput.trim() }
        : answers;

    if (q.type === "fib") {
      setAnswers(finalAnswers);
      setFibInput("");
    }

    if (isLast) {
      setSubmitted(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  // ── Results ──────────────────────────────────────────────────────────────────
  if (submitted) {
    const score = QUESTIONS.filter((q) =>
      checkAnswer(q, answers[q.id] ?? "")
    ).length;
    const total   = QUESTIONS.length;
    const pct     = score / total;
    const passing = pct >= 0.8;

    return (
      <div>
        <p className="text-xs tracking-widest mb-6" style={{ color: "var(--oc-green-dim)" }}>
          // RESULTS
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {QUESTIONS.map((q) => {
            const userAnswer = answers[q.id] ?? "";
            const correct    = checkAnswer(q, userAnswer);

            return (
              <div
                key={q.id}
                style={{
                  border: `1px solid ${correct ? BORDER_CORRECT : BORDER_WRONG}`,
                  background: correct ? LABEL_CORRECT : LABEL_WRONG,
                  borderRadius: "4px",
                  padding: "1rem 1.25rem",
                }}
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="font-heading text-xs shrink-0 mt-0.5"
                    style={{ color: correct ? "rgba(80,200,120,0.8)" : "rgba(220,80,80,0.8)", letterSpacing: "0.1em" }}
                  >
                    {correct ? "✓" : "✗"} Q{q.id}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text)" }}>
                    {q.question}
                  </p>
                </div>

                {/* User answer */}
                <div className="ml-7 flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-heading tracking-widest shrink-0" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>
                      YOUR ANSWER:
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: correct ? "rgba(80,200,120,1)" : "rgba(220,80,80,1)", fontWeight: 600 }}
                    >
                      {userAnswer === "" ? "(no answer)" : q.type === "tf" ? userAnswer.toUpperCase() : userAnswer}
                    </span>
                  </div>
                  {!correct && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-heading tracking-widest shrink-0" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>
                        CORRECT:
                      </span>
                      <span className="text-sm" style={{ color: "rgba(80,200,120,1)", fontWeight: 600 }}>
                        {q.type === "tf" ? q.correct.toUpperCase() : q.correct}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Score */}
        <div
          style={{
            border: `1px solid ${passing ? BORDER_CORRECT : "rgba(212,147,62,0.5)"}`,
            background: passing ? LABEL_CORRECT : "rgba(212,147,62,0.08)",
            borderRadius: "4px",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            className="font-heading mb-2"
            style={{ fontSize: "2.5rem", color: passing ? "rgba(80,200,120,1)" : "#d4933e", letterSpacing: "-0.02em" }}
          >
            {score} / {total}
          </p>
          <p className="text-base" style={{ color: "var(--oc-text-muted)" }}>
            {passing
              ? "Excellent work! You've got a solid grasp of the fundamentals."
              : "Keep practicing, you got this! Review the lessons and try again."}
          </p>
        </div>

        {/* Retry */}
        <button
          onClick={() => {
            setAnswers({});
            setFibInput("");
            setCurrent(0);
            setSubmitted(false);
          }}
          className="font-heading text-xs px-6 py-3 mt-6 transition-all duration-200"
          style={{
            border: "1px solid rgba(68,153,255,0.3)",
            color: "var(--oc-blue)",
            letterSpacing: "0.15em",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          ↩ TRY AGAIN
        </button>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2 font-heading" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>
          <span>QUESTION {current + 1} OF {QUESTIONS.length}</span>
          <span>{Math.round(((current) / QUESTIONS.length) * 100)}% COMPLETE</span>
        </div>
        <div className="h-px w-full" style={{ background: "var(--oc-green-border-dim)" }}>
          <div
            className="h-px transition-all duration-300"
            style={{ width: `${(current / QUESTIONS.length) * 100}%`, background: "var(--oc-blue)" }}
          />
        </div>
      </div>

      {/* Type badge */}
      <span
        className="font-heading text-xs px-2 py-0.5 mb-6 inline-block"
        style={{
          background: q.type === "mc" ? "rgba(68,153,255,0.08)" : q.type === "tf" ? "rgba(114,184,114,0.08)" : "rgba(212,147,62,0.08)",
          color: q.type === "mc" ? "var(--oc-blue)" : q.type === "tf" ? "var(--oc-green)" : "#d4933e",
          border: `1px solid ${q.type === "mc" ? "rgba(68,153,255,0.2)" : q.type === "tf" ? "rgba(114,184,114,0.2)" : "rgba(212,147,62,0.2)"}`,
          letterSpacing: "0.12em",
        }}
      >
        {q.type === "mc" ? "MULTIPLE CHOICE" : q.type === "tf" ? "TRUE / FALSE" : "FILL IN THE BLANK"}
      </span>

      {/* Question */}
      <p
        className="font-heading mb-8 leading-snug"
        style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "var(--oc-text)", letterSpacing: "0.03em" }}
      >
        {q.question}
      </p>

      {/* Answers */}
      {q.type === "mc" && (
        <div className="flex flex-col gap-3 mb-8">
          {q.options!.map((opt) => {
            const selected = answers[q.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => selectOption(opt)}
                className="text-left text-sm px-5 py-4 transition-all duration-150"
                style={{
                  border: `1px solid ${selected ? "rgba(68,153,255,0.6)" : "var(--oc-green-border-dim)"}`,
                  background: selected ? "rgba(68,153,255,0.1)" : "transparent",
                  color: selected ? "var(--oc-blue)" : "var(--oc-text-muted)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "tf" && (
        <div className="flex gap-4 mb-8">
          {(["true", "false"] as const).map((val) => {
            const selected = answers[q.id] === val;
            return (
              <button
                key={val}
                onClick={() => selectOption(val)}
                className="font-heading text-sm px-8 py-4 transition-all duration-150"
                style={{
                  border: `1px solid ${selected ? "rgba(68,153,255,0.6)" : "var(--oc-green-border-dim)"}`,
                  background: selected ? "rgba(68,153,255,0.1)" : "transparent",
                  color: selected ? "var(--oc-blue)" : "var(--oc-text-muted)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  letterSpacing: "0.12em",
                }}
              >
                {val.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "fib" && (
        <div className="mb-8">
          <input
            type="text"
            value={fibInput}
            onChange={(e) => setFibInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && hasAnswer) advance(); }}
            placeholder="Type your answer..."
            className="font-terminal text-sm px-4 py-3 outline-none w-full max-w-sm"
            style={{
              background: "var(--oc-green-bg-surface)",
              border: "1px solid var(--oc-green-border)",
              borderRadius: "4px",
              color: "var(--oc-text)",
              caretColor: "var(--oc-green)",
            }}
          />
        </div>
      )}

      {/* Next / Submit */}
      <button
        onClick={advance}
        disabled={!hasAnswer}
        className="font-heading text-xs px-8 py-3 transition-all duration-200"
        style={{
          background: hasAnswer ? "var(--oc-blue)" : "rgba(68,153,255,0.1)",
          color: hasAnswer ? "var(--oc-btn-text)" : "rgba(68,153,255,0.3)",
          letterSpacing: "0.15em",
          cursor: hasAnswer ? "pointer" : "not-allowed",
          border: "1px solid rgba(68,153,255,0.3)",
        }}
      >
        {isLast ? "SUBMIT →" : "NEXT →"}
      </button>
    </div>
  );
}
