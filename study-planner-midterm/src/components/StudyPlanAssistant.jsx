import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api.js'
import { MAX_TEXT, eligibleTasks, formatPlan, formatStudyDate, localDate, selectionSignature, textSize } from '../data/studyPlan.js'

const MAX_ACTIVITIES = 10

// Student-only preview. Nothing here changes activities, deadlines or completion.
export default function StudyPlanAssistant({ tasks, currentUser }) {
  const choices = useMemo(() => eligibleTasks(tasks, currentUser), [tasks, currentUser])
  const [startDate, setStartDate] = useState(() => localDate(0))
  const [endDate, setEndDate] = useState(() => localDate(2))
  const [dailyMinutes, setDailyMinutes] = useState('60')
  const [selected, setSelected] = useState([])
  const [preview, setPreview] = useState(null)
  const [confirmedToken, setConfirmedToken] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [planText, setPlanText] = useState('')
  const controller = useRef(null)
  const previewHeading = useRef(null)

  // Ignore choices that disappeared (for example after completing an activity).
  const chosen = selected.filter(id => choices.some(task => task.id === id))
  // A change to the account, dates or selected activities makes the old preview inactive.
  const signature = JSON.stringify([currentUser.id, startDate, endDate, dailyMinutes, selectionSignature(choices, chosen)])
  const currentPreview = preview?.signature === signature ? preview : null
  const confirmed = currentPreview && confirmedToken === currentPreview.previewToken
  const chosenTasks = choices.filter(task => chosen.includes(task.id))
  const today = localDate()
  const hasOverdueSelection = chosenTasks.some(task => task.dueDate < today)
  const tooLong = textSize(chosenTasks) > MAX_TEXT
  const busy = status === 'previewing' || status === 'loading'

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (currentPreview) previewHeading.current?.focus()
  }, [currentPreview])

  function change(setValue, value) {
    setValue(value)
    setPreview(null)
    setConfirmedToken('')
    setStatus('idle')
    setMessage('')
  }

  async function requestPlan(sendToProvider) {
    if (busy || (sendToProvider && !confirmed)) return
    controller.current?.abort()
    const request = new AbortController()
    controller.current = request
    setStatus(sendToProvider ? 'loading' : 'previewing')
    setMessage('')
    try {
      const input = { startDate, endDate, dailyMinutes: Number(dailyMinutes), activityIds: chosen }
      if (sendToProvider) {
        const result = await api('/ai/generate-plan', {
          method: 'POST', signal: request.signal,
          body: { ...input, confirmed: true, previewToken: currentPreview.previewToken },
        })
        if (request.signal.aborted) return
        setPlanText(formatPlan(result, currentPreview.activities))
        setPreview(null)
        setConfirmedToken('')
        setStatus('done')
      } else {
        // Show the server's copy of the activity text before asking for confirmation.
        const result = await api('/ai/plan-preview', { method: 'POST', signal: request.signal, body: input })
        if (request.signal.aborted) return
        setPreview({ ...result, signature })
        setConfirmedToken('')
        setStatus('idle')
      }
    } catch (error) {
      if (request.signal.aborted) return
      const needsNewReview = error.status >= 400 && error.status < 500 && error.status !== 429
      if (!sendToProvider || needsNewReview) {
        setPreview(null)
        setConfirmedToken('')
      }
      setMessage(error.message)
      setStatus('error')
    }
  }

  return <section className="card" aria-labelledby="plan-heading">
    <h2 id="plan-heading">Study plan assistant</h2>
    {choices.length === 0 ? <p>Add an unfinished activity to make a study plan.</p> : <>
      <p>Choose the days you want to study, the time you have each day, and up to {MAX_ACTIVITIES} activities. The plan suggests what to do in each session.</p>
      <div className="plan-grid">
        <div className="plan-field">
          <label htmlFor="study-start">First study day</label>
          <input id="study-start" type="date" value={startDate} disabled={busy} aria-describedby="study-start-date" onChange={event => change(setStartDate, event.target.value)} />
          <small id="study-start-date">{formatStudyDate(startDate, true)}</small>
        </div>
        <div className="plan-field">
          <label htmlFor="study-end">Last study day</label>
          <input id="study-end" type="date" value={endDate} disabled={busy} aria-describedby="study-end-date" onChange={event => change(setEndDate, event.target.value)} />
          <small id="study-end-date">{formatStudyDate(endDate, true)}</small>
        </div>
        <div className="plan-field">
          <label htmlFor="study-minutes">Minutes available per day</label>
          <input id="study-minutes" type="number" min="15" max="240" value={dailyMinutes} disabled={busy} onChange={event => change(setDailyMinutes, event.target.value)} />
        </div>
      </div>
      <fieldset className="plan-choices">
        <legend>Activities to plan</legend>
        {choices.map(task => <label key={task.id} className="plan-check">
          <input type="checkbox" checked={chosen.includes(task.id)} disabled={busy || (!chosen.includes(task.id) && chosen.length >= MAX_ACTIVITIES)}
            onChange={() => change(setSelected, chosen.includes(task.id) ? chosen.filter(id => id !== task.id) : [...chosen, task.id])} />
          <span>{task.title} <small>(due {formatStudyDate(task.dueDate)}{task.dueDate < today && ' · Overdue'})</small></span>
        </label>)}
        <div aria-live="polite">
          {hasOverdueSelection && <p className="plan-overdue-help">
            Include overdue activities to catch up or review. Uncheck any you want to leave out of this plan.
            Your study dates are separate from the original deadlines.
          </p>}
        </div>
      </fieldset>
      {tooLong && <p role="alert" className="field-error">Choose fewer activities to keep the text under {MAX_TEXT} characters.</p>}
      {currentPreview ? <div className="plan-preview">
        <h3 ref={previewHeading} tabIndex={-1}>Review what you’ll share</h3>
        <p>OpenRouter will use these details to suggest a study plan.</p>
        <p>Study from {formatStudyDate(startDate)} to {formatStudyDate(endDate)}, up to {dailyMinutes} minutes per day.</p>
        <ul>{currentPreview.activities.map(task => <li key={task.id}>
          <strong>{task.title}</strong> · {task.course} · Due {formatStudyDate(task.dueDate)}{task.dueDate < today && ' · Overdue'}
          {task.notes && <div>{task.notes}</div>}
        </li>)}</ul>
        <label className="plan-check">
          <input type="checkbox" checked={!!confirmed} disabled={busy} onChange={event => setConfirmedToken(event.target.checked ? currentPreview.previewToken : '')} />
          <span>I agree to send these details to OpenRouter.</span>
        </label>
        {status === 'error' && <p role="alert" className="field-error">{message}</p>}
        <button type="button" disabled={!confirmed || busy} onClick={() => requestPlan(true)}>
          {status === 'error' ? 'Try again' : 'Generate study plan'}
        </button>
        {status === 'loading' && <p role="status">Creating your study plan…</p>}
      </div> : <>
        {status === 'error' && <p role="alert" className="field-error">{message}</p>}
        <button type="button" disabled={chosen.length === 0 || tooLong || busy} onClick={() => requestPlan(false)}>
          {status === 'previewing' ? 'Loading…' : 'Review details'}
        </button>
      </>}
      {status === 'done' && <label className="plan-result">Your AI study plan
        <textarea rows={Math.min(14, planText.split('\n').length + 2)} value={planText} onChange={event => setPlanText(event.target.value)} />
      </label>}
    </>}
  </section>
}
