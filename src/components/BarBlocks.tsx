import { useMemo, useState } from 'react';

type SectionType = 'Intro' | 'Main' | 'Break' | 'Outro';
type Block = { id: string; type: SectionType };

const COLORS: Record<SectionType, string> = {
  Intro: '#acd9ff',
  Main: '#b8f0d4',
  Break: '#ffdf9e',
  Outro: '#f2b7cf',
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function BarBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uid(), type: 'Intro' },
    { id: uid(), type: 'Main' },
    { id: uid(), type: 'Break' },
    { id: uid(), type: 'Main' },
    { id: uid(), type: 'Outro' },
  ]);

  const summary = useMemo(
    () =>
      blocks
        .map((b) => (b.type === 'Intro' ? 'I' : b.type === 'Main' ? 'M' : b.type === 'Break' ? 'B' : 'O'))
        .join(' – '),
    [blocks]
  );

  function add(type: SectionType) {
    setBlocks((prev) => [...prev, { id: uid(), type }]);
  }

  function remove(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  // Drag-and-drop reorder using native HTML5 DnD
  const [dragId, setDragId] = useState<string | null>(null);

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === dragId);
      const to = prev.findIndex((b) => b.id === overId);
      if (from === -1 || to === -1) return prev;
      const copy = prev.slice();
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['Intro', 'Main', 'Break', 'Outro'] as SectionType[]).map((t) => (
          <button
            key={t}
            className="px-3 py-1 rounded border"
            style={{ background: COLORS[t] + '33', borderColor: COLORS[t] }}
            onClick={() => add(t)}
          >
            + {t}
          </button>
        ))}
      </div>

      <div className="rounded border overflow-hidden">
        <div className="flex flex-wrap">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="relative m-1 cursor-grab select-none"
              draggable
              onDragStart={() => onDragStart(b.id)}
              onDragOver={(e) => onDragOver(e, b.id)}
              style={{
                background: COLORS[b.type],
                border: '1px solid rgba(0,0,0,.08)',
                borderRadius: 8,
                width: 96,
                height: 48,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
              }}
              title="Drag to reorder"
            >
              {b.type}
              <button
                aria-label="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(b.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs"
                style={{ background: 'rgba(0,0,0,.5)', color: 'white' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm opacity-80">Order: {summary}</div>
    </div>
  );
}

