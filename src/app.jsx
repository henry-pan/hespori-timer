import React, { useState, useEffect } from "react";

export default function App() {
  const [hours, setHours] = useState(Math.trunc((640 - (((Date.now() / 1000) / 60) % 640)) / 60));
  const [mins, setMins] = useState(Math.trunc((640 - (((Date.now() / 1000) / 60) % 640)) % 60));
  const [offset, setOffset] = useState(localStorage.getItem("farmTickOffset") || 0);


  // Refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = 640 - (((Date.now() / 1000) / 60) % 640);
      setHours(Math.trunc(timeLeft / 60));
      setMins(Math.trunc(timeLeft % 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [hours, mins]);


  // Update localstorage when offset changed
  useEffect(() => {
    localStorage.setItem("farmTickOffset", offset);
  }, [offset]);


  // Determine next growth tick in local time
  const timeNow = new Date();

  let nextHours = hours;
  let nextMins = mins - offset;
  if (mins - offset < 0) {
    nextMins += 60;
    nextHours -= 1;
  }

  let localHours = timeNow.getHours() + nextHours;
  let localMins = timeNow.getMinutes() + nextMins + 1;
  if (localMins >= 60) localHours += 1;

  const period = (localHours % 24) >= 12 ? "PM" : "AM";

  localHours %= 12;
  localMins %= 60;
  
  let formattedHours = localHours === 0 ? `12` : localHours;
  let formattedMins = localMins <= 9 ? `0${localMins}` : localMins;
  let localTime = `${formattedHours}:${formattedMins} ${period}`;


  return (
    <div className="content">
      <header>
        <h1>Hespori Timer</h1>
      </header>
      <section>
        <h2>Next growth stage in</h2>
        <h2>{hours} hours, {mins} minutes</h2>
        <h2>{localTime}</h2>
      </section>
      <section>
        <h2>Offset</h2>
        <input type="number" onChange={e => setOffset(e.target.value)} value={offset} />
      </section>
    </div>
  );
}
