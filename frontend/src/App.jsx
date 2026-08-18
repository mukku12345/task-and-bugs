import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4 py-4">
          <h1 className="h3 fw-bold mb-1">
            Task &amp; Bug Tracker
          </h1>

          <p className="text-secondary mb-0">
            Create, filter, and move work across to-do, in-progress, and done.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid px-4 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}