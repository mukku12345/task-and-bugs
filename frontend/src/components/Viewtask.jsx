import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_LABELS = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function ViewTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTask() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/tasks/${id}`);
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || "Task not found");
        }
        setTask(body.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  return (
    <div className="task-detail-page">
      <header className="task-detail-page__header">
        <button type="button" className="btn btn--back" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1 className="task-detail-page__brand">Task &amp; Bug Tracker</h1>
      </header>

      <div className="task-detail-page__body">
        {loading && (
          <div className="state-panel">
            <div className="spinner" aria-hidden="true" />
            <p>Loading task...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-panel state-panel--error">
            <p>{error}</p>
            <Link to="/" className="btn btn--link">
              Back to all tasks
            </Link>
          </div>
        )}

        {!loading && !error && task && (
          <article className={`task-detail task-detail--${task.priority}`}>
            <header className="task-detail__header">
              <h2>{task.title}</h2>
              <span className={`badge badge--${task.priority}`}>{task.priority}</span>
            </header>

            {task.description && (
              <p className="task-detail__description">{task.description}</p>
            )}

            <dl className="task-detail__meta">
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`status-select status-select--${task.status}`}>
                    {STATUS_LABELS[task.status]}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{new Date(task.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </article>
        )}
      </div>
    </div>
  );
}