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

  async function handleDelete(id) {
    setBusyId(id);
    setActionError("");
    const previous = tasks;
    setTasks((curr) => curr.filter((t) => t._id !== id));
    try {
      await api.deleteTask(id);
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
          + Add task
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
        onDelete={handleDelete}
        busyId={busyId}
      />

      {showAddModal && (
        <Modal title="New task" onClose={() => setShowAddModal(false)}>
          <TaskForm onCreate={handleCreate} submitting={submitting} />
        </Modal>
      )}
    </div>
  );
}