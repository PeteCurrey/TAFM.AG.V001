'use client'

import React, { useState, useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import type { PipelineResult } from '@/lib/intelligence/pipeline'

// ─── Asset Intelligence page ───────────────────────────────────────────────────
//
// The user-facing intelligence tool. Accepts text, image, or document input.
// Displays the structured result with clear AI/verified/inferred distinction.
//
// Micro-interaction states: Analysing → Identifying → Structuring → Checking evidence → Result

type InputMode = 'text' | 'image' | 'document'

type AnalysisStage =
  | 'idle'
  | 'analysing'
  | 'identifying'
  | 'structuring'
  | 'checking'
  | 'complete'
  | 'error'

const STAGE_LABELS: Record<AnalysisStage, string> = {
  idle:        '',
  analysing:   'Analysing input…',
  identifying: 'Identifying asset…',
  structuring: 'Structuring data…',
  checking:    'Checking evidence…',
  complete:    'Analysis complete',
  error:       'Analysis failed',
}

const DATA_STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  VERIFIED:      { label: 'Verified',         dot: 'bg-emerald-500', text: 'text-emerald-400' },
  PROVISIONAL:   { label: 'Provisional',      dot: 'bg-blue-400',    text: 'text-blue-400' },
  USER_PROVIDED: { label: 'User-provided',    dot: 'bg-blue-400',    text: 'text-blue-400' },
  CALCULATED:    { label: 'AI-derived',       dot: 'bg-amber-400',   text: 'text-amber-400' },
  UNKNOWN:       { label: 'Insufficient data',dot: 'bg-neutral-500', text: 'text-neutral-400' },
  // UI-only aliases (not stored in DB — used for ResultRow display)
  KNOWN:         { label: 'Known',            dot: 'bg-blue-400',    text: 'text-blue-400' },
  INFERRED:      { label: 'AI-inferred',      dot: 'bg-amber-400',   text: 'text-amber-400' },
}

export default function AssetIntelligencePage() {
  const [mode, setMode]       = useState<InputMode>('text')
  const [stage, setStage]     = useState<AnalysisStage>('idle')
  const [result, setResult]   = useState<PipelineResult | null>(null)
  const [error, setError]     = useState<string | null>(null)

  // Text inputs
  const [description,   setDescription]   = useState('')
  const [manufacturer,  setManufacturer]  = useState('')
  const [model,         setModel]         = useState('')
  const [year,          setYear]          = useState('')

  // Image input
  const [imageBase64,   setImageBase64]   = useState<string | null>(null)
  const [imageMime,     setImageMime]     = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
  const [imagePreview,  setImagePreview]  = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Document input
  const [docText,       setDocText]       = useState('')
  const [docFilename,   setDocFilename]   = useState('')

  // ── Stage transition helper
  function progressStages(stages: AnalysisStage[], intervalMs = 900): Promise<void> {
    return new Promise((resolve) => {
      let i = 0
      const tick = () => {
        if (i < stages.length) {
          setStage(stages[i++])
          setTimeout(tick, intervalMs)
        } else {
          resolve()
        }
      }
      tick()
    })
  }

  // ── Image file handler
  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)
      // Strip "data:image/...;base64," prefix
      const base64 = dataUrl.split(',')[1] ?? ''
      setImageBase64(base64)
      const mime = file.type as 'image/jpeg' | 'image/png' | 'image/webp'
      setImageMime(mime)
    }
    reader.readAsDataURL(file)
  }

  // ── Main analysis function
  async function handleAnalyse() {
    setResult(null)
    setError(null)
    setStage('analysing')

    const stageSequence: AnalysisStage[] =
      mode === 'image' ? ['analysing', 'identifying', 'checking'] :
      mode === 'document' ? ['analysing', 'structuring', 'checking'] :
      ['analysing', 'identifying', 'structuring', 'checking']

    // Start stage animation (non-blocking)
    progressStages(stageSequence).catch(() => undefined)

    try {
      let endpoint: string
      let body: unknown

      if (mode === 'text') {
        endpoint = '/api/ai/classify'
        body = {
          description,
          manufacturer: manufacturer || undefined,
          model:        model        || undefined,
          year:         year         ? Number(year) : undefined,
        }
      } else if (mode === 'image') {
        if (!imageBase64) { setError('Please select an image first.'); setStage('idle'); return }
        endpoint = '/api/ai/analyse-image'
        body = { base64Data: imageBase64, mimeType: imageMime, description: description || undefined }
      } else {
        if (!docText.trim()) { setError('Please paste document text first.'); setStage('idle'); return }
        endpoint = '/api/ai/extract-document'
        body = { textContent: docText, filename: docFilename || undefined }
      }

      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json()

      setStage('complete')

      if (!res.ok) {
        setError(json.error ?? 'Analysis failed. Please try again.')
        setStage('error')
        return
      }

      // For the text/classify endpoint, wrap the response in a PipelineResult shape
      if (mode === 'text' && json.data && !json.data.success) {
        setResult({
          success:        true,
          dataStatus:     'CALCULATED',
          confidence:     json.data.categoryConfidence ?? 0.5,
          requiresReview: true,
          jobId:          json.meta?.jobId ?? '',
          classification: {
            category:   json.data.category,
            assetType:  json.data.assetType,
            confidence: json.data.categoryConfidence,
            isNew:      json.data.isNewAsset,
            condition:  json.data.estimatedCondition,
          },
          disclaimer: json.meta?.disclaimer ?? '',
        })
      } else {
        setResult(json.data)
      }
    } catch {
      setError('A network error occurred. Please check your connection and try again.')
      setStage('error')
    }
  }

  const isLoading = stage !== 'idle' && stage !== 'complete' && stage !== 'error'

  return (
    <>
      {/* Page header */}
      <Section className="pt-24 pb-10 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs text-orange-500 uppercase tracking-widest mb-3 font-medium">
              Asset Intelligence
            </p>
            <h1 className="text-4xl font-extralight text-text-primary mb-4">
              Understand your asset
            </h1>
            <p className="text-text-secondary font-light leading-relaxed">
              Provide asset details, an image, or a document. TAFM will structure the available 
              information and identify what is confirmed, inferred, or missing — before any finance 
              assessment begins.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">

            {/* ── Input panel */}
            <div className="space-y-6">

              {/* Mode selector */}
              <div>
                <p className="text-xs text-text-tertiary uppercase tracking-wider mb-3">Input type</p>
                <div className="flex gap-0">
                  {(['text', 'image', 'document'] as InputMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={[
                        'flex-1 px-3 py-2 text-xs font-medium border transition-colors',
                        'first:rounded-l-sm last:rounded-r-sm',
                        mode === m
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-transparent border-border text-text-secondary hover:border-text-tertiary',
                      ].join(' ')}
                    >
                      {m === 'text' ? 'Description' : m === 'image' ? 'Image' : 'Document'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text mode */}
              {mode === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-secondary block mb-1.5">Asset description <span className="text-orange-500">*</span></label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the asset — what it is, what it does, any known specifications…"
                      rows={4}
                      className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-secondary block mb-1.5">Manufacturer (optional)</label>
                      <input
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        placeholder="e.g. Caterpillar, Volvo"
                        className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-secondary block mb-1.5">Model (optional)</label>
                      <input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. 320D, FH16"
                        className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary block mb-1.5">Year of manufacture (optional)</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2021"
                      min={1900}
                      max={new Date().getFullYear() + 2}
                      className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Image mode */}
              {mode === 'image' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-3">
                      Upload a photo of the asset. The AI will attempt to identify the category, 
                      manufacturer, and visible features. If reliable identification is not possible, 
                      this will be stated clearly.
                    </p>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className={[
                        'border border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors',
                        imagePreview ? 'border-orange-500/50' : 'border-border hover:border-text-tertiary',
                      ].join(' ')}
                    >
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Asset preview" className="max-h-48 mx-auto object-contain rounded-sm" />
                      ) : (
                        <>
                          <p className="text-text-secondary text-sm mb-1">Click to upload image</p>
                          <p className="text-text-tertiary text-xs">JPEG, PNG or WebP</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFile}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary block mb-1.5">Additional context (optional)</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Any hints about what this asset is…"
                      className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Document mode */}
              {mode === 'document' && (
                <div className="space-y-4">
                  <p className="text-xs text-text-secondary">
                    Paste the text content from an invoice, specification sheet, or asset schedule. 
                    The AI will extract structured information. Documents are not authenticated — 
                    all extracted values require verification.
                  </p>
                  <div>
                    <label className="text-xs text-text-secondary block mb-1.5">Document filename (optional)</label>
                    <input
                      value={docFilename}
                      onChange={(e) => setDocFilename(e.target.value)}
                      placeholder="e.g. invoice-2024-001.pdf"
                      className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary block mb-1.5">Document text content <span className="text-orange-500">*</span></label>
                    <textarea
                      value={docText}
                      onChange={(e) => setDocText(e.target.value)}
                      placeholder="Paste the text from the document here…"
                      rows={8}
                      className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-orange-500 resize-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Analyse button + stage indicator */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAnalyse}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? STAGE_LABELS[stage] : 'Analyse asset'}
                </button>

                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1 h-1 rounded-full bg-orange-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary">{STAGE_LABELS[stage]}</span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="border border-red-900/50 bg-red-950/30 rounded-sm px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* ── Result panel */}
            <div>
              {!result && stage === 'idle' && (
                <div className="border border-border rounded-sm p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-10 h-10 border border-border rounded-sm flex items-center justify-center mb-4">
                    <span className="text-text-tertiary text-lg">∅</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-2">No analysis yet</p>
                  <p className="text-text-tertiary text-xs max-w-xs text-center">
                    Provide asset information on the left and click Analyse to begin.
                  </p>
                </div>
              )}

              {!result && isLoading && (
                <div className="border border-border rounded-sm p-8 min-h-[400px] flex flex-col items-center justify-center">
                  <div className="space-y-3 w-full max-w-xs">
                    {(['analysing', 'identifying', 'structuring', 'checking'] as AnalysisStage[]).map((s) => {
                      const stages: AnalysisStage[] = ['analysing', 'identifying', 'structuring', 'checking']
                      const currentIdx = stages.indexOf(stage)
                      const thisIdx    = stages.indexOf(s)
                      const isDone     = thisIdx < currentIdx
                      const isActive   = s === stage
                      return (
                        <div key={s} className={[
                          'flex items-center gap-3 text-xs transition-opacity',
                          isActive ? 'opacity-100' : isDone ? 'opacity-40' : 'opacity-20',
                        ].join(' ')}>
                          <div className={[
                            'w-1.5 h-1.5 rounded-full flex-shrink-0',
                            isActive ? 'bg-orange-500 animate-pulse' : isDone ? 'bg-emerald-500' : 'bg-neutral-600',
                          ].join(' ')} />
                          <span className={isActive ? 'text-text-primary' : 'text-text-secondary'}>
                            {STAGE_LABELS[s]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {result && <IntelligenceResult result={result} />}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

// ─── Result display component ─────────────────────────────────────────────────

function IntelligenceResult({ result }: { result: PipelineResult }) {
  const statusConfig = DATA_STATUS_CONFIG[result.dataStatus] ?? DATA_STATUS_CONFIG.UNKNOWN

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="border border-border rounded-sm px-4 py-3 flex items-center justify-between bg-surface-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
          <span className={`text-xs font-medium ${statusConfig.text}`}>{statusConfig.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary">
            Confidence: {Math.round(result.confidence * 100)}%
          </span>
          <span className="text-xs text-amber-400 border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 rounded-sm">
            Requires review
          </span>
        </div>
      </div>

      {/* Classification */}
      {result.classification && (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-surface-2">
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Classification</p>
          </div>
          <div className="divide-y divide-border">
            <ResultRow label="Category"   value={result.classification.category} status="INFERRED" />
            <ResultRow label="Asset type" value={result.classification.assetType} status="INFERRED" />
            <ResultRow label="Condition"  value={result.classification.condition} status="INFERRED" />
            <ResultRow label="Is new"     value={result.classification.isNew ? 'Yes' : 'No'} status="INFERRED" />
          </div>
        </div>
      )}

      {/* Spec extraction */}
      {result.specExtraction && (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-surface-2">
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Specification extraction</p>
          </div>
          <div className="divide-y divide-border">
            {result.specExtraction.manufacturer && (
              <ResultRow label="Manufacturer" value={result.specExtraction.manufacturer}
                status={result.specExtraction.confidence > 0.7 ? 'KNOWN' : 'INFERRED'} />
            )}
            {result.specExtraction.model && (
              <ResultRow label="Model" value={result.specExtraction.model}
                status={result.specExtraction.confidence > 0.7 ? 'KNOWN' : 'INFERRED'} />
            )}
            {result.specExtraction.yearOfManufacture && (
              <ResultRow label="Year" value={String(result.specExtraction.yearOfManufacture)}
                status="INFERRED" />
            )}
            {result.specExtraction.serialNumber && (
              <ResultRow label="Serial number" value={result.specExtraction.serialNumber} status="KNOWN" />
            )}
            {Object.entries(result.specExtraction.specifications ?? {}).map(([k, v]) => (
              <ResultRow key={k} label={k} value={v} status="INFERRED" />
            ))}
          </div>

          {result.specExtraction.missingFields.length > 0 && (
            <div className="px-4 py-3 border-t border-border bg-surface-2">
              <p className="text-xs text-text-tertiary mb-1.5">Could not determine:</p>
              <div className="flex flex-wrap gap-1.5">
                {result.specExtraction.missingFields.map((f) => (
                  <span key={f} className="text-xs px-2 py-0.5 border border-border rounded-sm text-text-secondary">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image analysis */}
      {result.imageSummary && (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Image analysis</p>
            <span className="text-xs text-text-tertiary">Quality: {result.imageSummary.imageQuality}</span>
          </div>

          {result.imageSummary.cannotIdentify ? (
            <div className="px-4 py-4">
              <p className="text-sm text-text-secondary mb-1">Unable to identify asset from image</p>
              {result.imageSummary.cannotIdentifyReason && (
                <p className="text-xs text-text-tertiary">{result.imageSummary.cannotIdentifyReason}</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {result.imageSummary.assetCategory && <ResultRow label="Category" value={result.imageSummary.assetCategory} status="INFERRED" />}
              {result.imageSummary.manufacturer   && <ResultRow label="Manufacturer" value={result.imageSummary.manufacturer} status="INFERRED" />}
              {result.imageSummary.modelFamily    && <ResultRow label="Model family" value={result.imageSummary.modelFamily} status="INFERRED" />}
            </div>
          )}

          {result.imageSummary.visibleFeatures.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs text-text-tertiary mb-1.5">Observable features:</p>
              <ul className="space-y-1">
                {result.imageSummary.visibleFeatures.map((f, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="text-text-tertiary mt-0.5">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Document extraction */}
      {result.docExtraction && (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-surface-2 flex items-center justify-between">
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Document extraction</p>
            <span className="text-xs text-text-tertiary">
              {result.docExtraction.documentType} · Quality: {result.docExtraction.extractionQuality}
            </span>
          </div>
          <div className="divide-y divide-border">
            {result.docExtraction.extractedFields.map((f) => (
              <ResultRow
                key={f.field}
                label={f.field}
                value={f.value}
                status={f.confidence > 0.8 ? 'KNOWN' : 'INFERRED'}
                meta={`${Math.round(f.confidence * 100)}% confidence`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Intelligence summary */}
      {result.intelligenceSummary && !result.intelligenceSummary.cannotIdentify && (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-surface-2">
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Intelligence summary</p>
          </div>
          {result.intelligenceSummary.confirmedInformation.length > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-medium text-emerald-400 mb-2">Confirmed from input</p>
              {result.intelligenceSummary.confirmedInformation.map((c) => (
                <ResultRow key={c.field} label={c.field} value={c.value} status="KNOWN" />
              ))}
            </div>
          )}
          {result.intelligenceSummary.inferredInformation.length > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-medium text-amber-400 mb-2">AI-inferred (not confirmed)</p>
              {result.intelligenceSummary.inferredInformation.map((c) => (
                <ResultRow key={c.field} label={c.field} value={c.value} status="INFERRED" meta={c.reasoning} />
              ))}
            </div>
          )}
          {result.intelligenceSummary.missingInformation.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-xs font-medium text-text-tertiary mb-2">Missing information</p>
              {result.intelligenceSummary.missingInformation.map((m) => (
                <div key={m.field} className="flex items-center gap-2 py-1 text-xs">
                  <span className={`text-[10px] px-1 py-0.5 rounded-sm border ${
                    m.importance === 'CRITICAL' ? 'border-red-800 text-red-400 bg-red-950/30' :
                    m.importance === 'IMPORTANT' ? 'border-amber-800 text-amber-400 bg-amber-950/30' :
                    'border-border text-text-tertiary'
                  }`}>
                    {m.importance}
                  </span>
                  <span className="text-text-secondary">{m.field}</span>
                  <span className="text-text-tertiary">— {m.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-amber-900/30 bg-amber-950/10 rounded-sm px-4 py-3">
        <p className="text-xs text-amber-200/70 leading-relaxed">
          <strong className="text-amber-400 font-medium">AI-generated analysis.</strong>{' '}
          {result.disclaimer}
        </p>
      </div>
    </div>
  )
}

function ResultRow({
  label,
  value,
  status,
  meta,
}: {
  label:  string
  value:  string
  status: 'VERIFIED' | 'KNOWN' | 'INFERRED' | 'PROVISIONAL' | 'CALCULATED' | 'USER_PROVIDED' | 'UNKNOWN'
  meta?:  string
}) {
  const cfg = DATA_STATUS_CONFIG[status]
  return (
    <div className="grid grid-cols-[140px_1fr_80px] gap-2 items-center px-4 py-2 text-xs">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">
        {value}
        {meta && <span className="text-text-tertiary ml-2">({meta})</span>}
      </span>
      <div className="flex items-center gap-1 justify-end">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span className={`${cfg.text} text-[10px]`}>{cfg.label}</span>
      </div>
    </div>
  )
}
