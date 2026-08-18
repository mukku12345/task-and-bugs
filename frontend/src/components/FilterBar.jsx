export default function FilterBar({ filters, onChange, onClear, taskCount }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="filter-bar">
      <div className="field field--inline">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by title..."
        />
      </div>

      <div className="field field--inline">
        <label htmlFor="status-filter">Status</label>
        <select id="status-filter" name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="field field--inline">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="field field--inline">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" name="sort" value={filters.sort} onChange={handleChange}>
          <option value="-createdAt">Newest first</option>
          <option value="createdAt">Oldest first</option>
          <option value="-priority">Priority (high → low)</option>
          <option value="priority">Priority (low → high)</option>
        </select>
      </div>

      <div className="filter-bar__meta">
        <span>{taskCount} task{taskCount === 1 ? "" : "s"}</span>
        {hasActiveFilters && (
          <button type="button" className="btn btn--link" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
