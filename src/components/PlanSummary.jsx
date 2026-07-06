const priorityScore = {
  High: 3,
  Medium: 2,
  Low: 1
};

function formatDuration(totalMinutes, t) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} ${t.minutes}`;
  }

  if (minutes === 0) {
    return `${hours} ${t.hour}`;
  }

  return `${hours} ${t.hour} ${minutes} ${t.minutes}`;
}

export default function PlanSummary({ spots, t }) {
  const sortedSpots = [...spots].sort((firstSpot, secondSpot) => {
    return priorityScore[secondSpot.priority] - priorityScore[firstSpot.priority];
  });

  const totalMinutes = spots.reduce((sum, spot) => sum + Number(spot.visitTime), 0);
  const highPriorityCount = spots.filter((spot) => spot.priority === "High").length;

  return (
    <aside className="panel plan-summary">
      <div>
        <p className="eyebrow">{t.suggestedPlan}</p>
        <h2>{t.routeOrder}</h2>
      </div>

      <div className="stats-grid">
        <div>
          <span>{spots.length}</span>
          <p>{t.stops}</p>
        </div>
        <div>
          <span>{formatDuration(totalMinutes, t)}</span>
          <p>{t.totalTime}</p>
        </div>
        <div>
          <span>{highPriorityCount}</span>
          <p>{t.mustSee}</p>
        </div>
      </div>

      {sortedSpots.length === 0 ? (
        <div className="empty-state compact">
          <h3>{t.planWaiting}</h3>
          <p>{t.planWaitingText}</p>
        </div>
      ) : (
        <ol className="route-list">
          {sortedSpots.map((spot) => (
            <li key={spot.id}>
              <span>{spot.name}</span>
              <small>
                {t.priorities[spot.priority] || spot.priority} · {spot.visitTime}{" "}
                {t.minutes}
                {spot.personalRating ? ` · ${t.personalRating} ${spot.personalRating}` : ""}
              </small>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
