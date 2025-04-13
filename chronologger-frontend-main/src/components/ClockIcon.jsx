import '../styles/clockIcon.css';

const ClockIcon = ({background = '#e9ecef'}) => {
  return(
    <div className="main-circle">
      <div className="inner-circle" style={{ backgroundColor: background }}>

        <div className="minutes-line">
          <div className="colored-minutes-line"></div>
        </div>

        <div className="center-dot"></div>

        <div className="hours-line">
          <div className="colored-hours-line"></div>
        </div>

      </div>
    </div>
  );
}

export default ClockIcon;