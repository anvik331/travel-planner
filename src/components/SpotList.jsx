const priorityClass = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low"
};

export default function SpotList({ spots, onDeleteSpot, t }) {
  return (
    <section className="panel spot-list">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t.yourIdeas}</p>
          <h2>{t.savedSpots}</h2>
        </div>
        <span className="count-pill">
          {spots.length} {t.spots}
        </span>
      </div>

      {spots.length === 0 ? (
        <div className="empty-state">
          <h3>{t.noSpots}</h3>
          <p>{t.noSpotsText}</p>
        </div>
      ) : (
        <div className="spot-cards">
          {spots.map((spot) => (
            <article className="spot-card" key={spot.id}>
              <div className="spot-card-top">
                <div>
                  <h3>{spot.name}</h3>
                  <p>
                    {spot.area} · {t.categories[spot.category] || spot.category}
                  </p>
                </div>
                <span className={`priority-pill ${priorityClass[spot.priority]}`}>
                  {t.priorities[spot.priority] || spot.priority}
                </span>
              </div>

              <div className="spot-meta">
                <span>
                  {spot.visitTime} {t.minutes}
                </span>
                {spot.personalRating && (
                  <span>
                    {t.personalRating}: {spot.personalRating} / 5
                  </span>
                )}
                {spot.address && <span>{spot.address}</span>}
                {spot.notes && <span>{spot.notes}</span>}
              </div>

              <button
                className="ghost-button"
                type="button"
                onClick={() => onDeleteSpot(spot.id)}
              >
                {t.delete}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
