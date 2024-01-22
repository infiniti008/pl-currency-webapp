function IconPlus({ onClick }) {
  return (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 48 48" version="1" enableBackground="new 0 0 48 48" style={{cursor: 'pointer' }}>
      <circle fill="#4CAF50" cx="24" cy="24" r="21"/>
      <g fill="#ffffff">
          <rect x="21" y="14" width="6" height="20"/>
          <rect x="14" y="21" width="20" height="6"/>
      </g>
    </svg>
  );
}

export default IconPlus;