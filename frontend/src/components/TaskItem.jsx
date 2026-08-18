import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function TaskItem({ task, onStatusChange, onEdit, onDelete, busy }) {
  const navigate = useNavigate();

  function handleRowClick() {
    navigate(`/tasks/${task._id}`);
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <li
      className={`task-item task-item--${task.priority}`}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleRowClick()}
    >
      <div className="task-item__main">
        <div className="task-item__title-row">
          <h3 className="task-item__title">{task.title}</h3>
          <span className={`badge badge--${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <p className="task-item__meta">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="task-item__actions" onClick={stop}>
        <select
          aria-label={`Status for ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          disabled={busy}
          className={`status-select status-select--${task.status}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn--edit"
          onClick={() => onEdit(task)}
          disabled={busy}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(task)}
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
