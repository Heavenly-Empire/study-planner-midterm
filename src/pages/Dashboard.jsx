// Member 3 will build this page in incremental commits.
export default function Dashboard({ onNavigate }) {
  return (
    <main>
      <button className="text-button" onClick={() => onNavigate('menu')}>Back to menu</button>
      <div className="page-heading"><span className="eyebrow">DASHBOARD</span><h2>Study tasks</h2></div>
      <p>Dashboard work is in progress.</p>
    </main>
  );
}
