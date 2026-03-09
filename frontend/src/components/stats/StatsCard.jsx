import './StatsCard.css';

const StatsCard = ({ icon, title, value, color = 'blue', onClick }) => {
  return (
    <div className={`stats-card stats-card--${color}`} onClick={onClick}>
      <div className="stats-card-content">
        <div className={`stats-icon stats-icon--${color}`}>
          {icon}
        </div>
        
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <h3 className="stats-value">{value}</h3>
        </div>
      </div>
      
      {onClick && (
        <div className="stats-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default StatsCard;