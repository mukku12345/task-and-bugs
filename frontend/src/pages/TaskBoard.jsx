import { useEffect, useState, useCallback } from "react";
import TaskForm from "../components/TaskForm.jsx";
import FilterBar from "../components/FilterBar.jsx";
import TaskList from "../components/TaskList.jsx";
import Modal from "../components/Modal.jsx";
import * as api from "../api.js";

const initialFilters = { status: "", priority: "", search: "", sort: "-createdAt" };

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const loadTasks = useCallback(async (currentFilters) => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.fetchTasks(currentFilters);
      setTasks(res.data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadTasks(filters), 300);
    return () => clearTimeout(timeout);
  }, [filters, loadTasks]);

  async function handleCreate(newTask) {
    setSubmitting(true);
    setActionError("");
    try {
      await api.createTask(newTask);
      await loadTasks(filters);
      setShowAddModal(false); // close modal on success
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id, status) {
    setBusyId(id);
    setActionError("");
    const previous = tasks;
    setTasks((curr) => curr.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await api.updateTask(id, { status });
    } catch (err) {
      setActionError(err.message);
      setTasks(previous);
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdate(updates) {
    if (!taskToEdit) return false;

    setSubmitting(true);
    setActionError("");
    try {
      const res = await api.updateTask(taskToEdit._id, updates);
      setTasks((current) =>
        current.map((task) => (task._id === taskToEdit._id ? res.data : task))
      );
      setTaskToEdit(null);
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!taskToDelete) return;

    const id = taskToDelete._id;
    setBusyId(id);
    setActionError("");
    const previous = tasks;
    setTasks((curr) => curr.filter((t) => t._id !== id));
    try {
      await api.deleteTask(id);
      setTaskToDelete(null);
    } catch (err) {
      setActionError(err.message);
      setTasks(previous);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="task-board">
      <div className="task-board__header">
        <h2 className="task-board__title">Tasks</h2>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowAddModal(true)}
        >
          <span aria-hidden="true">+</span> Add task
        </button>
      </div>

      {actionError && (
        <div className="banner banner--error" role="alert">
          {actionError}
          <button
            type="button"
            className="banner__dismiss"
            onClick={() => setActionError("")}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(initialFilters)}
        taskCount={tasks.length}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={loadError}
        onStatusChange={handleStatusChange}
        onEdit={setTaskToEdit}
        onDelete={setTaskToDelete}
        busyId={busyId}
      />

      {showAddModal && (
        <Modal title="New task" onClose={() => setShowAddModal(false)}>
          <TaskForm onSubmit={handleCreate} submitting={submitting} />
        </Modal>
      )}

      {taskToEdit && (
        <Modal title="Edit task" onClose={() => !submitting && setTaskToEdit(null)}>
          <TaskForm
            initialTask={{
              title: taskToEdit.title,
              description: taskToEdit.description || "",
              priority: taskToEdit.priority,
              status: taskToEdit.status,
            }}
            onSubmit={handleUpdate}
            submitting={submitting}
            submitLabel="Save changes"
          />
        </Modal>
      )}

      {taskToDelete && (
        <Modal title="Delete task?" onClose={() => !busyId && setTaskToDelete(null)}>
          <div className="delete-confirmation">
            <div className="delete-confirmation__icon" aria-hidden="true">!</div>
            <p>
              Delete <strong>{taskToDelete.title}</strong>? This action cannot be undone.
            </p>
            <div className="delete-confirmation__actions">
              <button type="button" className="btn btn--secondary" onClick={() => setTaskToDelete(null)} disabled={Boolean(busyId)}>
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={Boolean(busyId)}>
                {busyId ? "Deleting..." : "Delete task"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
