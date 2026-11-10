import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api.js'
import { MAX_TEXT, eligibleTasks, formatPlan, localDate, selectionSignature, textSize } from '../data/studyPlan.js'

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

  // Ignore choices that disappeared (for example after completing an activity).
  const chosen = selected.filter(id => choices.some(task => task.id === id))
  const signature = JSON.stringify([currentUser.id, startDate, endDate, dailyMinutes, selectionSignature(choices, chosen)])
  const currentPreview = preview?.signature === signature ? preview : null
  const confirmed = currentPreview && confirmedToken === currentPreview.previewToken
  const chosenTasks = choices.filter(task => chosen.includes(task.id))
  const tooLong = textSize(chosenTasks) > MAX_TEXT
  const busy = status === 'previewing' || status === 'loading'

  useEffect(() => () => controller.current?.abort(), [])

  function change(setValue, value) {
    setValue(value)
    setPreview(null)
    setConfirmedToken('')
    setStatus('idle')
    setMessage('')
  }

  async function requestPlan(generate) {
    if (busy || (generate && !confirmed)) return
    controller.current?.abort()
    const request = new AbortController()
    controller.current = request
    setStatus(generate ? 'loading' : 'previewing')
    setMessage('')
    try {
      const input = { startDate, endDate, dailyMinutes: Number(dailyMinutes), activityIds: chosen }
      if (generate) {
        const result = await api('/ai/generate-plan', {
          method: 'POST', signal: request.signal,
          body: { ...input, confirmed: true, previewToken: currentPreview.previewToken },
        })
        if (request.signal.aborted) return
        setPlanText(formatPlan(result, currentPreview.activities) || 'No plan items were returned.')
        setConfirmedToken('')
        setStatus('done')
      } else {
        const result = await api('/ai/plan-preview', { method: 'POST', signal: request.signal, body: input })
        if (request.signal.aborted) return
        setPreview({ ...result, signature })
        setConfirmedToken('')
        setStatus('idle')
      }
    } catch (error) {
      if (request.signal.aborted) return
      setPreview(null)
      setConfirmedToken('')
      setMessage(error.message)
      setStatus('error')
    }
  }

  return <section className="card" aria-labelledby="plan-heading">
    <h2 id="plan-heading">Study plan assistant</h2>
    {choices.length === 0 ? <p>No unfinished activities to plan. Add an activity or mark one incomplete to try the assistant.</p> : <>
      <p>Pick up to {MAX_ACTIVITIES} unfinished activities and a short date range. The assistant suggests a plan you can edit. It does not change your activities.</p>
      <div className="plan-grid">
        <label>Start date <input type="date" value={startDate} disabled={busy} onChange={event => change(setStartDate, event.target.value)} /></label>
        <label>End date <input type="date" value={endDate} disabled={busy} onChange={event => change(setEndDate, event.target.value)} /></label>
        <label>Minutes per day <input type="number" min="15" max="240" value={dailyMinutes} disabled={busy} onChange={event => change(setDailyMinutes, event.target.value)} /></label>
      </div>
      <fieldset className="plan-choices">
        <legend>Activities to plan</legend>
        {choices.map(task => <label key={task.id} className="plan-choice">
          <input type="checkbox" checked={chosen.includes(task.id)} disabled={busy || (!chosen.includes(task.id) && chosen.length >= MAX_ACTIVITIES)}
            onChange={() => change(setSelected, chosen.includes(task.id) ? chosen.filter(id => id !== task.id) : [...chosen, task.id])} /> {task.title} <small>(due {task.dueDate})</small>
        </label>)}
      </fieldset>
      {tooLong && <p role="alert" className="field-error">These activities have too much text for one plan (limit {MAX_TEXT} characters). Choose fewer.</p>}
      <div className="actions">
        <button type="button" disabled={chosen.length === 0 || tooLong || busy} onClick={() => requestPlan(false)}>{status === 'previewing' ? 'Loading preview…' : 'Review text to send'}</button>
      </div>
      {currentPreview && <div className="plan-preview" aria-live="polite">
        <h3>Text that will be sent</h3>
        <p>{startDate} to {endDate}, {dailyMinutes} minutes per day.</p>
        <ul>{currentPreview.activities.map(task => <li key={task.id}><strong>{task.title}</strong>, {task.course}, due {task.dueDate}. Notes: {task.notes || 'none'}</li>)}</ul>
        <p>Generating sends this activity text and your planning dates and time limit to OpenRouter. The preview is valid for five minutes.</p>
        <label><input type="checkbox" checked={!!confirmed} disabled={busy} onChange={event => setConfirmedToken(event.target.checked ? currentPreview.previewToken : '')} /> I checked this text and agree to send it.</label>
        <button type="button" disabled={!confirmed || busy} onClick={() => requestPlan(true)}>{status === 'loading' ? 'Generating…' : 'Generate plan'}</button>
      </div>}
      {status === 'loading' && <p aria-live="polite">Asking the AI provider. This can take up to 15 seconds.</p>}
      {status === 'error' && <p role="alert" className="field-error">{message} Your choices are kept. Review the text again to retry.</p>}
      {status === 'done' && <label className="plan-result">AI-suggested study plan (you can edit this text)
        <textarea rows={Math.min(14, planText.split('\n').length + 2)} value={planText} onChange={event => setPlanText(event.target.value)} />
      </label>}
    </>}
  </section>
}
