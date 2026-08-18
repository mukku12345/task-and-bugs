import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null); // null until loaded
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function fetchTask() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`${API_URL}/tasks/${id}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Task not found");
        setForm({
          title: body.data.title,
          description: body.data.description || "",
          priority: body.data.priority,
          status: body.data.status,
        });
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  function validate(values) {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required.";
    else if (values.title.trim().length > 120) next.title = "Title must be 120 characters or fewer.";
    if (values.description.length > 1000) next.description = "Description must be 1000 characters or fewer.";
    return next;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (errors[name]) setErrors(validate(next));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to update task");
      navigate(`/`);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

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

        {!loading && loadError && (
          <div className="state-panel state-panel--error">
            <p>{loadError}</p>
            <Link to="/" className="btn btn--link">
              Back to all tasks
            </Link>
          </div>
        )}

        {!loading && !loadError && form && (
          <form className="task-form task-form--page" onSubmit={handleSubmit} noValidate>
            <h2 className="task-form__heading">Edit task</h2>

            {saveError && (
              <div className="banner banner--error" role="alert">
                {saveError}
              </div>
            )}

            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p className="field__error" id="title-error">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
              />
              {errors.description && (
                <p className="field__error" id="description-error">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="task-form__row">
              <div className="field">
                <label htmlFor="priority">Priority</label>
                <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange}>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="task-form__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className="btn btn--link"
                onClick={() => navigate(`/`)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}