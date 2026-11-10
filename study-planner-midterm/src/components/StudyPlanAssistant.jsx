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
  const [confirmedSignature, setConfirmedSignature] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')
  const [planText, setPlanText] = useState('')
  const controller = useRef(null)

  // Ignore choices that disappeared (for example after completing an activity).
  const chosen = selected.filter(id => choices.some(task => task.id === id))
  const signature = selectionSignature(choices, chosen)
  const confirmed = chosen.length > 0 && confirmedSignature === signature
  const chosenTasks = choices.filter(task => chosen.includes(task.id))
  const tooLong = textSize(chosenTasks) > MAX_TEXT

  useEffect(() => () => controller.current?.abort(), [])

  function toggle(id) {
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  async function generate() {
    controller.current?.abort()
    controller.current = new AbortController()
    setStatus('loading'); setMessage('')
    try {
      const result = await api('/ai/generate-plan', {
        method: 'POST', signal: controller.current.signal,
        body: { startDate, endDate, dailyMinutes: Number(dailyMinutes), activityIds: chosen },
      })
      setPlanText(formatPlan(result, choices) || 'No plan items were returned.')
      setStatus('done')
    } catch (error) {
      if (error.name === 'AbortError') return
      setMessage(error.message); setStatus('error') // form values stay as they were
    }
  }

  return <section className="card" aria-labelledby="plan-heading">
    <h2 id="plan-heading">Study plan assistant</h2>
    {choices.length === 0 ? <p>No unfinished activities to plan. Add an activity or mark one incomplete to try the assistant.</p> : <>
      <p>Pick up to {MAX_ACTIVITIES} unfinished activities and a short date range. The assistant suggests a plan you can edit. It does not change your activities.</p>
      <div className="plan-grid">
        <label>Start date <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} /></label>
        <label>End date <input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} /></label>
        <label>Minutes per day <input type="number" min="15" max="240" step="5" value={dailyMinutes} onChange={event => setDailyMinutes(event.target.value)} /></label>
      </div>
      <fieldset className="plan-choices">
        <legend>Activities to plan</legend>
        {choices.map(task => <label key={task.id} className="plan-choice">
          <input type="checkbox" checked={chosen.includes(task.id)} disabled={!chosen.includes(task.id) && chosen.length >= MAX_ACTIVITIES}
            onChange={() => toggle(task.id)} /> {task.title} <small>(due {task.dueDate})</small>
        </label>)}
      </fieldset>
      {chosenTasks.length > 0 && <div className="plan-preview" aria-live="polite">
        <h3>Text that will be sent</h3>
        <ul>{chosenTasks.map(task => <li key={task.id}><strong>{task.title}</strong>, {task.course}, due {task.dueDate}. Notes: {task.notes || 'none'}</li>)}</ul>
        <p>Generating sends these titles, courses, due dates and notes to an outside AI provider. Your name and account details are not sent.</p>
        {tooLong && <p role="alert" className="field-error">These activities have too much text for one plan (limit {MAX_TEXT} characters). Choose fewer.</p>}
        <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmedSignature(event.target.checked ? signature : '')} /> I checked this text and agree to send it.</label>
      </div>}
      <div className="actions">
        <button type="button" disabled={!confirmed || tooLong || status === 'loading'} onClick={generate}>{status === 'loading' ? 'Generating…' : 'Generate plan'}</button>
      </div>
      {status === 'loading' && <p aria-live="polite">Asking the AI provider. This can take up to 15 seconds.</p>}
      {status === 'error' && <p role="alert" className="field-error">{message} Your choices are kept, so you can try again.</p>}
      {status === 'done' && <label className="plan-result">AI-suggested study plan (you can edit this text)
        <textarea rows={Math.min(14, planText.split('\n').length + 2)} value={planText} onChange={event => setPlanText(event.target.value)} />
      </label>}
    </>}
  </section>
}
