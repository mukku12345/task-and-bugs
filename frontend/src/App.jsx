import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Task &amp; Bug Tracker</h1>
        <p>Create, filter, and move work across to-do, in-progress, and done.</p>
      </header>
      <main className="app__layout">
        <Outlet />
      </main>
    </div>
  );
}