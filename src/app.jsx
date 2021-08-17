import React, { useState, useEffect } from "react";

export default function App() {
  const [hours, setHours] = useState(10);
  const [mins, setMins] = useState(40);
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

  const handleInput = e => setOffset(e.target.value);

  const timeNow = new Date();

  let nextHours = hours;
  let nextMins = mins - offset;
  if (mins - offset < 0) {
    nextMins += 60;
    nextHours -= 1;
  }

  let localHour = timeNow.getHours() + nextHours;
  let localMins = timeNow.getMinutes() + nextMins + 1;
  if (localMins >= 60) localHour += 1;

  const period = localHour > 12 ? "PM" : "AM";

  localHour %= 12;
  localMins %= 60;
  
  let formattedMins = localMins <= 9 ? `0${localMins}` : localMins;
  let localTime = `${localHour}:${formattedMins} ${period}`;


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
        <input type="number" onChange={handleInput} value={offset} />
      </section>
    </div>
  );
}
