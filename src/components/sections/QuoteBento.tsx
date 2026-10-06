"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CreditCard, Truck, Megaphone, Check, PenLine, ArrowRight, X, Eye, Pencil, Trash2 } from "lucide-react";

interface Draft {
  id:        string;
  title:     string;
  content:   string;
  createdAt: number;
  status:    "draft" | "sent";
}

// Quick-start chips — tapping one pre-fills the editor with a starter
// sentence so people with only a vague idea don't face a blank box.
const QUICK_STARTS = [
  { icon: CreditCard, label: "Business cards",   prompt: "I need 500 business cards, matte finish, double-sided, full colour — " },
  { icon: Truck,      label: "Vehicle branding", prompt: "I need a vehicle wrap for our delivery van — full wrap with logo and contact details, urgent — " },
  { icon: Megaphone,  label: "Event banner",     prompt: "I need a 3x2m vinyl banner for our event next week — full colour with eyelets — " },
];

// Keywords to highlight as the user types — print-shop relevant
const KEYWORDS = {
  urgent:    ["urgent", "asap", "today", "tomorrow", "rush", "same day", "same-day", "immediately"],
  quantity:  /\b\d+\s*(pieces?|pcs|units?|copies|sets?|cards?|sheets?|boxes|bags)\b/gi,
  product:   ["business cards", "tshirt", "t-shirt", "tshirts", "hoodie", "banner", "flyer", "mug", "sticker", "poster", "letterhead", "envelope", "tote", "cap", "polo", "apron"],
  finish:    ["matte", "gloss", "glossy", "double-sided", "double sided", "single-sided", "full colour", "full color", "vinyl", "sublimation", "embroidery", "embroidered"],
};

// Generate a title from the content (first ~40 chars)
function titleFromContent(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "Untitled quote";
  const firstLine = trimmed.split("\n")[0];
  return firstLine.length > 50 ? firstLine.slice(0, 50) + "…" : firstLine;
}

// Relative time formatter
function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60)       return "just now";
  if (seconds < 3600)     return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)    return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800)   return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}

// Build the overlay HTML for the highlight layer
function highlightContent(text: string): string {
  if (!text) return "";
  let html = text;
  // Escape HTML first
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Urgency (red-tinted)
  KEYWORDS.urgent.forEach((word) => {
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    html = html.replace(re, '<mark class="kw-urgent">$1</mark>');
  });
  // Products (indigo)
  KEYWORDS.product.forEach((word) => {
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    html = html.replace(re, '<mark class="kw-product">$1</mark>');
  });
  // Finishes (teal)
  KEYWORDS.finish.forEach((word) => {
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    html = html.replace(re, '<mark class="kw-finish">$1</mark>');
  });
  // Quantities (amber)
  html = html.replace(KEYWORDS.quantity, '<mark class="kw-quantity">$&</mark>');
  // Preserve line breaks
  return html.replace(/\n/g, "<br/>");
}

const STORAGE_KEY = "angela_quote_drafts";

export default function QuoteBento() {
  const [drafts,    setDrafts]    = useState<Draft[]>([]);
  const [expanded,  setExpanded]  = useState(false);
  const [text,      setText]      = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewing,   setViewing]   = useState<Draft | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);

  // Load drafts from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDrafts(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Persist drafts whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  // Sync overlay scroll with textarea scroll
  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop  = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Open the editor
  const openEditor = (existing?: Draft) => {
    if (existing) {
      setText(existing.content);
      setEditingId(existing.id);
    } else {
      setText("");
      setEditingId(null);
    }
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // Quick-start chip — pre-fill with a starter sentence, expand, and put
  // the cursor at the end so the person can just keep typing.
  const startQuick = (prompt: string) => {
    setEditingId(null);
    setText(prompt);
    setExpanded(true);
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(prompt.length, prompt.length);
      }
    }, 50);
  };

  // Save (create or update)
  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingId) {
      // Update existing draft
      setDrafts((prev) => prev.map((d) =>
        d.id === editingId
          ? { ...d, content: trimmed, title: titleFromContent(trimmed) }
          : d
      ));
    } else {
      // New draft
      const newDraft: Draft = {
        id:        `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title:     titleFromContent(trimmed),
        content:   trimmed,
        createdAt: Date.now(),
        status:    "draft",
      };
      setDrafts((prev) => [newDraft, ...prev]);
    }

    setText("");
    setEditingId(null);
    setExpanded(false);
  };

  const handleCancel = () => {
    setText("");
    setEditingId(null);
    setExpanded(false);
  };

  const handleDelete = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    setConfirmDelete(null);
  };

  return (
    <>
      <div className="mb-4">
        {/* The bento card itself — glass panel: translucent dark base,
            backdrop blur, soft top sheen and glow for a premium, tactile feel */}
        <div
          className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          style={{ background: "linear-gradient(160deg, rgba(5,27,57,0.97), rgba(48,42,120,0.93))" }}
        >
          {/* Glossy highlight — top sheen + soft corner glow, like light hitting glass */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-24 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 w-56 h-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">

            {/* Left: explainer */}
            <div className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white text-[11px] font-semibold rounded-full px-3 py-1 mb-4 ring-1 ring-white/15 backdrop-blur-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
                Custom orders
              </span>
              <h3 className="text-2xl font-semibold text-white mb-3 leading-snug">
                Need something special?
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-md">
                Describe your idea — quantity, finish, deadline, anything. We&apos;ll send a clear
                quote fast. Save drafts and come back anytime.
              </p>
              <div className="space-y-2 text-sm text-white/75">
                <p className="flex items-center gap-3">
                  <Check size={15} className="text-indigo-300 shrink-0" />
                  Type freely — we highlight key details
                </p>
                <p className="flex items-center gap-3">
                  <Check size={15} className="text-indigo-300 shrink-0" />
                  Edit or delete any draft anytime
                </p>
                <p className="flex items-center gap-3">
                  <Check size={15} className="text-indigo-300 shrink-0" />
                  Drafts saved on your device
                </p>
              </div>
            </div>

            {/* Right: quick-start + live preview + editor */}
            <div className="lg:col-span-3 p-6 lg:p-8">

              {!expanded ? (
                <div className="flex flex-col gap-3.5">
                  {/* Quick-start chips */}
                  <div>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-white/45 mb-2">
                      Quick start
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_STARTS.map(({ icon: Icon, label, prompt }) => (
                        <button
                          key={label}
                          onClick={() => startQuick(prompt)}
                          className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 active:scale-95 border border-white/12 hover:border-white/25 rounded-full px-3 py-1.5 text-xs text-white/85 hover:text-white backdrop-blur-sm transition-all"
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live highlight preview — shows the highlighting feature before anyone types */}
                  <div className="bg-black/20 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-[9px] font-medium tracking-widest uppercase text-white/40 mb-1.5">
                      See it highlight as you type
                    </p>
                    <p className="text-xs leading-relaxed text-white/80">
                      <mark className="bg-red-500/25 text-red-200 rounded px-0.5">Urgent</mark> —{" "}
                      <mark className="bg-amber-500/25 text-amber-200 rounded px-0.5">500 pcs</mark>{" "}
                      <mark className="bg-indigo-400/25 text-indigo-200 rounded px-0.5">business cards</mark>,{" "}
                      <mark className="bg-emerald-500/20 text-emerald-200 rounded px-0.5">matte</mark>, deliver Friday
                    </p>
                  </div>

                  {/* Input trigger — styled to unmistakably read as a text field */}
                  <button
                    onClick={() => openEditor()}
                    className="w-full text-left flex items-center justify-between bg-white/8 hover:bg-white/14 border border-white/15 hover:border-indigo-300/50 rounded-2xl px-5 py-4 backdrop-blur-sm transition-all group"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-white/70 group-hover:text-white/90">
                      <PenLine size={16} className="shrink-0" />
                      Describe your custom order — quick &amp; easy
                    </span>
                    <span className="flex items-center gap-1 text-xs text-indigo-200 group-hover:text-white shrink-0">
                      Start <ArrowRight size={14} />
                    </span>
                  </button>
                </div>
              ) : (
                /* Expanded glossy editor */
                <div className="bg-black/25 backdrop-blur-md border border-white/15 rounded-xl shadow-lg overflow-hidden">
                  {/* Top label */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-white/85">
                      {editingId ? "Editing draft" : "New custom order"}
                    </p>
                    <button onClick={handleCancel} className="text-white/60 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  {/* Editor area — highlight overlay sits underneath the textarea.
                      Both layers MUST share identical font, padding, line-height & letter-spacing
                      so character positions match exactly (otherwise text selection drifts). */}
                  <div className="relative h-44">
                    <div
                      ref={overlayRef}
                        aria-hidden="true"
                        className="qb-layer absolute inset-0 overflow-auto pointer-events-none text-transparent"
                      dangerouslySetInnerHTML={{ __html: highlightContent(text) + "<br/>" }}
                    />
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onScroll={handleScroll}
                      spellCheck={false}
                      placeholder="e.g. I need 500 matte business cards, double-sided, full colour, urgent — delivery by Friday to Westlands..."
                      className="qb-layer absolute inset-0 w-full h-full bg-transparent text-white placeholder:text-white/60 outline-none resize-none caret-indigo-200 selection:bg-indigo-400/40 selection:text-white"
                    />
                  </div>

                  {/* Footer with legend + actions */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
                    <div className="flex items-center gap-3 text-[10px] text-white/75">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-red-500/30 border border-red-500/50" /> Urgent
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-indigo-400/30 border border-indigo-400/50" /> Product
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-emerald-500/30 border border-emerald-500/50" /> Finish
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded bg-amber-500/30 border border-amber-500/50" /> Quantity
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCancel}
                        className="text-xs text-white/70 hover:text-white px-3 py-1.5 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSubmit} disabled={!text.trim()}
                        className="flex items-center gap-1.5 text-xs bg-white hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed text-brand-950 font-medium px-4 py-1.5 rounded-full transition-colors">
                        {editingId ? "Save changes" : "Add to drafts"} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Drafts list */}
              {drafts.length > 0 && (
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-white/45">
                      Your drafts ({drafts.length})
                    </p>
                    <Link href="/quote" className="text-[10px] text-indigo-200 hover:text-white">
                      Send all to Angela →
                    </Link>
                  </div>
                  {drafts.map((draft) => (
                    <div key={draft.id} className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{draft.title}</p>
                        <p className="text-[10px] text-white/55 mt-0.5">{timeAgo(draft.createdAt)}</p>
                      </div>
                      {confirmDelete === draft.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-red-300">Delete?</span>
                          <button onClick={() => handleDelete(draft.id)}
                            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center transition-colors">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs flex items-center justify-center transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewing(draft)}
                            title="View"
                            className="w-7 h-7 rounded-lg hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => openEditor(draft)}
                            title="Edit"
                            className="w-7 h-7 rounded-lg hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirmDelete(draft.id)}
                            title="Delete"
                            className="w-7 h-7 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-300 flex items-center justify-center transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          /* Editor layers share geometry so highlights line up. Use site sans for readability. */
          .qb-layer {
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue";
            font-size: 14px;
            line-height: 1.6;
            letter-spacing: 0;
            padding: 12px 16px;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: break-word;
            tab-size: 4;
          }
          /* Highlight marks — NO padding/margin/border allowed, else characters drift */
          .kw-urgent,
          .kw-product,
          .kw-finish,
          .kw-quantity {
            border-radius: 2px;
            padding: 0;
            margin: 0;
            color: transparent;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
          }
          .kw-urgent   { background: rgba(239, 68, 68, 0.22); }
          .kw-product  { background: rgba(130, 124, 230, 0.26); }
          .kw-finish   { background: rgba(16, 185, 129, 0.18); }
          .kw-quantity { background: rgba(245, 158, 11, 0.18); }
          .modal-view mark.kw-urgent   { color: #FCA5A5 !important; }
          .modal-view mark.kw-product  { color: #C9C6F2 !important; }
          .modal-view mark.kw-finish   { color: #86EFAC !important; }
          .modal-view mark.kw-quantity { color: #FCD34D !important; }
        `}</style>
      </div>

      {/* View modal */}
      {viewing && (
        <div className="modal-view fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewing(null)}>
          <div onClick={(e) => e.stopPropagation()}
            className="border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl backdrop-blur-xl"
            style={{ background: "rgba(5,27,57,0.95)" }}
          >
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-white/45">Custom order draft</p>
                <p className="text-sm font-medium text-white mt-1">{viewing.title}</p>
                <p className="text-xs text-white/50 mt-0.5">Saved {timeAgo(viewing.createdAt)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-white/60 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div
              className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed mb-5 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: highlightContent(viewing.content) }}
            />
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button onClick={() => { openEditor(viewing); setViewing(null); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-white hover:bg-brand-100 text-brand-950 py-2.5 rounded-full transition-colors">
                <Pencil size={13} /> Edit
              </button>
              <Link href="/quote"
                className="flex-1 text-xs text-center border border-white/15 text-indigo-200 hover:text-white hover:border-indigo-300/50 py-2.5 rounded-full transition-colors">
                Send to Angela →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}