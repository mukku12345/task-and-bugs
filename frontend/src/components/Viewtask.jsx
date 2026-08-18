import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_LABELS = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const STATUS_CLASSES = {
  todo: "bg-secondary-subtle text-secondary",
  "in-progress": "bg-primary-subtle text-primary",
  done: "bg-success-subtle text-success",
};

const PRIORITY_CLASSES = {
  low: "bg-success-subtle text-success",
  medium: "bg-warning-subtle text-warning-emphasis",
  high: "bg-danger-subtle text-danger",
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
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4 px-lg-5 py-3">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <div>
              <h1 className="h5 fw-bold mb-0">
                Task &amp; Bug Tracker
              </h1>

              <small className="text-secondary">
                Task details
              </small>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-fluid px-3 px-md-4 px-lg-5 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10 col-xxl-9">

            {/* Loading */}
            {loading && (
              <div className="card border-0 shadow-sm">
                <div className="card-body py-5 text-center">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                    aria-hidden="true"
                  />

                  <h5 className="fw-semibold">
                    Loading task...
                  </h5>

                  <p className="text-secondary mb-0">
                    Please wait while we fetch the task details.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="card border-0 shadow-sm">
                <div className="card-body py-5 text-center">
                  <div
                    className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: 56, height: 56, fontSize: 24 }}
                  >
                    !
                  </div>

                  <h4 className="fw-bold">
                    Task not found
                  </h4>

                  <p className="text-secondary mb-4">
                    {error}
                  </p>

                  <Link
                    to="/"
                    className="btn btn-primary px-4"
                  >
                    Back to all tasks
                  </Link>
                </div>
              </div>
            )}

            {/* Task */}
            {!loading && !error && task && (
              <div className="card border-0 shadow-sm overflow-hidden">

                {/* Priority indicator */}
                <div
                  className={`border-start border-4 ${
                    task.priority === "high"
                      ? "border-danger"
                      : task.priority === "medium"
                      ? "border-warning"
                      : "border-success"
                  }`}
                >
                  <div className="card-body p-4 p-lg-5">

                    {/* Title */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="text-uppercase small fw-semibold text-secondary">
                            Task
                          </span>

                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              PRIORITY_CLASSES[task.priority] ||
                              "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h2 className="display-6 fw-bold mb-0">
                          {task.title}
                        </h2>
                      </div>

                      {/* Status */}
                      <span
                        className={`badge rounded-pill px-3 py-2 fs-6 ${
                          STATUS_CLASSES[task.status] ||
                          "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {STATUS_LABELS[task.status] || task.status}
                      </span>
                    </div>

                    {/* Divider */}
                    <hr className="my-4" />

                    {/* Description */}
                    <section className="mb-5">
                      <h6 className="fw-bold mb-3">
                        Description
                      </h6>

                      {task.description ? (
                        <div
                          className="p-4 rounded-3 bg-light border"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          <p className="text-secondary mb-0 lh-lg">
                            {task.description}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-3 bg-light border text-secondary">
                          No description provided.
                        </div>
                      )}
                    </section>

                    {/* Information */}
                    <section>
                      <h6 className="fw-bold mb-3">
                        Task Information
                      </h6>

                      <div className="row g-3">

                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded-3 border bg-white h-100">
                            <small className="text-uppercase text-secondary fw-semibold">
                              Status
                            </small>

                            <div className="mt-2 fw-semibold">
                              {STATUS_LABELS[task.status] ||
                                task.status}
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded-3 border bg-white h-100">
                            <small className="text-uppercase text-secondary fw-semibold">
                              Priority
                            </small>

                            <div className="mt-2 fw-semibold text-capitalize">
                              {task.priority}
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded-3 border bg-white h-100">
                            <small className="text-uppercase text-secondary fw-semibold">
                              Created
                            </small>

                            <div className="mt-2 fw-semibold">
                              {new Date(
                                task.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded-3 border bg-white h-100">
                            <small className="text-uppercase text-secondary fw-semibold">
                              Task ID
                            </small>

                            <div
                              className="mt-2 text-secondary small text-break"
                              style={{
                                fontFamily: "monospace",
                              }}
                            >
                              {task.id || task._id || id}
                            </div>
                          </div>
                        </div>

                      </div>
                    </section>

                    {/* Bottom action */}
                    <div className="d-flex justify-content-end mt-4 pt-4 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={() => navigate(-1)}
                      >
                        ← Back to tasks
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}