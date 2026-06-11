export function createTable(columns, rows, emptyMessage = '등록된 데이터가 없습니다.') {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrap';

  if (!rows.length) {
    wrapper.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
    return wrapper;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) => `
            <tr>
              ${columns
                .map((column) => {
                  const value = typeof column.render === 'function'
                    ? column.render(row)
                    : row[column.key];
                  return `<td>${value ?? '-'}</td>`;
                })
                .join('')}
            </tr>
          `,
        )
        .join('')}
    </tbody>
  `;

  wrapper.appendChild(table);
  return wrapper;
}
