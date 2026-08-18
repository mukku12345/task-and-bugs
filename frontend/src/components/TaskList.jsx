import { useState, useEffect } from "react";
import TaskItem from "./TaskItem.jsx";

const PAGE_SIZE = 5;

export default function TaskList({
  tasks,
  loading,
  error,
  onStatusChange,
  onEdit,
  onDelete,
  busyId,
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [tasks]);

  if (loading) {
    return (
      <div className="state-panel task-list-state">
        <div className="spinner" aria-hidden="true" />
        <h3>Loading your tasks</h3>
        <p>Please wait while we fetch your latest tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-panel--error task-list-state">
        <div className="state-panel__icon">!</div>
        <h3>Unable to load tasks</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-panel task-list-state task-list-state--empty">
        <div className="state-panel__icon">✓</div>
        <h3>No tasks found</h3>
        <p>
          No tasks match your current filters. Try changing your filters or
          create a new task.
        </p>
      </div>
    );
  }

  const visibleTasks = tasks.slice(0, visibleCount);
  const remaining = tasks.length - visibleCount;
  const hasMore = remaining > 0;

  return (
    <section className="task-list-wrapper">
      <div className="task-board__header">
        <div>
          <h2 className="task-board__title">Your Tasks</h2>
          <p className="task-board__subtitle">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
          </p>
        </div>

        <div className="task-board__count">
          Showing {visibleTasks.length} of {tasks.length}
        </div>
      </div>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            busy={busyId === task._id}
          />
        ))}
      </ul>

      {hasMore && (
        <div className="task-list__load-more">
          <button
            type="button"
            className="btn btn--secondary task-list__load-more-btn"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more
            <span className="task-list__remaining">
              {remaining} remaining
            </span>
          </button>
        </div>
      )}

      {!hasMore && tasks.length > PAGE_SIZE && (
        <div className="task-list__end">
          <span>✓</span>
          You've reached the end of your tasks
        </div>
      )}
    </section>
  );
}
