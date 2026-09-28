function Profile({ currentUser }) {
  const isLecturer = currentUser.role === "administrator";
  const roleLabel = isLecturer ? "Lecturer" : "Student";

  const canCreate = isLecturer
    ? "Class activities (visible to everyone)"
    : "Private activities (visible only to you)";

  const canView = isLecturer
    ? "All class activities"
    : "All class activities and your own private activities";

  return (
    <main className="page">
      <h1>Profile</h1>
      <div className="card">
        <dl className="profile-list">
          <dt>Username</dt>
          <dd>{currentUser.username}</dd>

          <dt>Role</dt>
          <dd>{roleLabel}</dd>

          <dt>Can create</dt>
          <dd>{canCreate}</dd>

          <dt>Can view</dt>
          <dd>{canView}</dd>
        </dl>
      </div>
    </main>
  );
}

export default Profile;
