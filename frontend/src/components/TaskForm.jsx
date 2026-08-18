import { useState } from "react";

const initialState = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
};

export default function TaskForm({ initialTask = initialState, onSubmit, submitting, submitLabel = "Create task" }) {
  const [form, setForm] = useState(initialTask);
  const [errors, setErrors] = useState({});

  function validate(values) {
    const next = {};
    if (!values.title.trim()) {
      next.title = "Title is required.";
    } else if (values.title.trim().length > 120) {
      next.title = "Title must be 120 characters or fewer.";
    }
    if (values.description.length > 1000) {
      next.description = "Description must be 1000 characters or fewer.";
    }
    return next;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (errors[name]) {
      setErrors(validate(next));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const ok = await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });

    if (ok) {
      setForm(initialTask);
      setErrors({});
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Fix login redirect bug"
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
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details..."
          rows={3}
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

      <button type="submit" className="btn btn--primary task-form__submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
