import { useMemo, useState } from "react";
import { demoBeats, type DemoEvent } from "../../data/demo";

function EventView({ event }: { event: DemoEvent }) {
  switch (event.kind) {
    case "thinking":
      return (
        <div className="demo-event thinking">
          <span className="event-label">Thinking</span>
          <p>{event.text}</p>
        </div>
      );
    case "tool":
      return (
        <div className="demo-event tool">
          <span className="event-label">Tool · {event.name}</span>
          {event.input ? (
            <pre className="event-code">{event.input}</pre>
          ) : null}
          <pre className="event-code output">{event.output}</pre>
        </div>
      );
    case "skill":
      return (
        <div className="demo-event skill">
          <span className="event-label">Skill loaded</span>
          <p>
            <code>{event.name}</code>
          </p>
        </div>
      );
    case "subagent":
      return (
        <div className="demo-event subagent">
          <span className="event-label">Subagent · {event.name}</span>
          <p>{event.summary}</p>
        </div>
      );
    case "approval":
      return (
        <div className="demo-event approval">
          <span className="event-label">Approval required</span>
          <p>{event.reason}</p>
          <pre className="event-code">{event.sql}</pre>
          <p className="approval-note">
            Session is parked. Approve to resume the same durable turn.
          </p>
        </div>
      );
    case "assistant":
      return (
        <div className="demo-event assistant">
          <span className="event-label">Assistant</span>
          <p>{event.text}</p>
        </div>
      );
  }
}

export default function AnalystDemo() {
  const [index, setIndex] = useState(0);
  const [approved, setApproved] = useState(false);
  const beat = demoBeats[index]!;

  const visibleEvents = useMemo(() => {
    if (beat.id !== "approval") return beat.events;
    if (approved) {
      return [
        ...beat.events.filter((e) => e.kind !== "assistant"),
        {
          kind: "tool" as const,
          name: "run_sql",
          input: "SELECT * FROM order_items",
          output: JSON.stringify(
            {
              rows: "… truncated to MAX_ROWS=200 …",
              rowCount: 200,
              status: "resumed after approval",
            },
            null,
            2,
          ),
        },
        {
          kind: "assistant" as const,
          text: "Approved. Returned the first 200 order_items rows in the same session.",
        },
      ];
    }
    return beat.events;
  }, [beat, approved]);

  function go(next: number) {
    setIndex(next);
    setApproved(false);
  }

  return (
    <div className="demo-shell" aria-label="Simulated eve-analyst walkthrough">
      <div className="demo-banner" role="note">
        <strong>Simulated walkthrough</strong>
        <span>
          Deterministic client-only demo based on eve-analyst scenarios. No live
          model or backend.
        </span>
      </div>

      <div className="demo-beats" role="tablist" aria-label="Demo scenarios">
        {demoBeats.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? "beat active" : "beat"}
            onClick={() => go(i)}
          >
            <span className="beat-num">{i + 1}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="demo-stage" role="tabpanel">
        <div className="bubble user">
          <span className="bubble-label">You</span>
          <p>{beat.user}</p>
        </div>

        <ol className="timeline">
          {visibleEvents.map((event, i) => (
            <li key={`${beat.id}-${i}`}>
              <EventView event={event} />
            </li>
          ))}
        </ol>

        {beat.id === "approval" && !approved ? (
          <div className="demo-actions">
            <button
              type="button"
              className="approve-btn"
              onClick={() => setApproved(true)}
            >
              Approve query
            </button>
            <span className="hint">Simulates durable HITL resume</span>
          </div>
        ) : null}

        <div className="demo-nav">
          <button
            type="button"
            className="nav-btn"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="nav-btn primary"
            disabled={index === demoBeats.length - 1}
            onClick={() => go(index + 1)}
          >
            Next scenario
          </button>
        </div>
      </div>

      <style>{`
        .demo-shell {
          border: 1px solid var(--border, #b2d4dd);
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 12px 40px rgba(106, 40, 44, 0.12);
          overflow: hidden;
        }
        .demo-banner {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          padding: 0.85rem 1.1rem;
          background: color-mix(in srgb, #6a282c 10%, white);
          border-bottom: 1px solid color-mix(in srgb, #6a282c 22%, #b2d4dd);
          font-size: 0.92rem;
          color: #4a3f40;
        }
        .demo-banner strong {
          color: #4a1c1f;
        }
        .demo-beats {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #b2d4dd;
          background: color-mix(in srgb, #b2d4dd 22%, white);
        }
        .beat {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 9999px;
          padding: 0.4rem 0.75rem;
          font: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a3f40;
          cursor: pointer;
        }
        .beat.active {
          background: #6a282c;
          color: white;
        }
        .beat-num {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 9999px;
          display: grid;
          place-items: center;
          font-size: 0.7rem;
          background: color-mix(in srgb, currentColor 18%, transparent);
        }
        .demo-stage {
          padding: 1.15rem 1.15rem 1.35rem;
        }
        .bubble {
          border-radius: 18px 18px 18px 8px;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          background: color-mix(in srgb, #b2d4dd 45%, white);
          border: 1px solid #b2d4dd;
        }
        .bubble-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a282c;
          margin-bottom: 0.3rem;
        }
        .bubble p {
          margin: 0;
          color: #1a1415;
        }
        .timeline {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.75rem;
        }
        .demo-event {
          border: 1px solid #b2d4dd;
          border-radius: 16px;
          padding: 0.8rem 0.95rem;
          background: #f8fbfc;
        }
        .demo-event.approval {
          border-color: color-mix(in srgb, #6a282c 40%, #b2d4dd);
          background: color-mix(in srgb, #6a282c 7%, white);
        }
        .demo-event.assistant {
          background: white;
        }
        .event-label {
          display: inline-block;
          margin-bottom: 0.35rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a282c;
        }
        .demo-event p {
          margin: 0;
          color: #4a3f40;
          font-size: 0.95rem;
        }
        .event-code {
          margin: 0.45rem 0 0;
          padding: 0.7rem 0.8rem;
          border-radius: 10px;
          background: #4a1c1f;
          color: #f4f7f8;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.78rem;
          overflow-x: auto;
          white-space: pre-wrap;
        }
        .event-code.output {
          background: #1a1415;
        }
        .approval-note {
          margin-top: 0.55rem !important;
          font-size: 0.88rem !important;
        }
        .demo-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .approve-btn {
          border: none;
          background: #6a282c;
          color: white;
          border-radius: 9999px;
          padding: 0.65rem 1.1rem;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
        }
        .approve-btn:hover {
          background: #4a1c1f;
        }
        .hint {
          color: #6b5e5f;
          font-size: 0.88rem;
        }
        .demo-nav {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid #b2d4dd;
        }
        .nav-btn {
          border: 1px solid color-mix(in srgb, #6a282c 30%, #b2d4dd);
          background: white;
          color: #6a282c;
          border-radius: 9999px;
          padding: 0.55rem 0.95rem;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
        }
        .nav-btn.primary {
          background: #6a282c;
          color: white;
          border-color: #6a282c;
        }
        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
