'use client'

import React, { useState, useTransition } from 'react'
import { updatePilotFeedbackStatusAction } from '@/app/actions/pilot-feedback'

interface Props {
  id: string
  currentStatus: string
  initialNotes?: string | null
}

export function PilotFeedbackStatusUpdater({ id, currentStatus, initialNotes }: Props) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(initialNotes || '')
  const [showNotes, setShowNotes] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleUpdate = (newStatus: string) => {
    setStatus(newStatus)
    startTransition(async () => {
      const res = await updatePilotFeedbackStatusAction({
        id,
        status: newStatus as any,
        resolutionNotes: notes || undefined,
      })
      if (res.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  const handleSaveNotes = () => {
    startTransition(async () => {
      const res = await updatePilotFeedbackStatusAction({
        id,
        status: status as any,
        resolutionNotes: notes || undefined,
      })
      if (res.success) {
        setSaved(true)
        setShowNotes(false)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={status}
          disabled={isPending}
          onChange={(e) => handleUpdate(e.target.value)}
          className="bg-[#181818] border border-zinc-700 text-xs text-white rounded px-2 py-1 font-mono focus:outline-none focus:border-amber-400 disabled:opacity-50"
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="DEFERRED">DEFERRED</option>
        </select>

        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="text-[11px] text-zinc-400 hover:text-white underline font-mono"
        >
          {notes ? 'Edit note' : '+ Add note'}
        </button>

        {saved && (
          <span className="text-[11px] text-emerald-400 font-mono">Saved ✓</span>
        )}
      </div>

      {showNotes && (
        <div className="pt-2 space-y-1.5">
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add triage notes or resolution details..."
            className="w-full bg-[#181818] border border-zinc-700 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveNotes}
              className="px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-[11px] font-mono rounded transition-colors"
            >
              {isPending ? 'Saving...' : 'Save Note'}
            </button>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {notes && !showNotes && (
        <p className="text-[11px] text-zinc-400 italic bg-black/30 p-2 rounded border border-zinc-800">
          Resolution note: {notes}
        </p>
      )}
    </div>
  )
}
