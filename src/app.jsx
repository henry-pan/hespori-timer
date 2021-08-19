import React, { useState, useEffect } from "react";

export default function App() {
  const [hours, setHours] = useState(Math.trunc((640 - (((Date.now() / 1000) / 60) % 640)) / 60));
  const [mins, setMins] = useState(Math.trunc((640 - (((Date.now() / 1000) / 60) % 640)) % 60));
  const [offset, setOffset] = useState(localStorage.getItem("farmTickOffset") || 0);


  // Determine new time by subtracting the offset
  const setNewTime = () => {
    let timeLeft = 640 - (((Date.now() / 1000) / 60) % 640);
    timeLeft -= offset - 1;
    
    // Ensures timeLeft is always between 0 and 640
    while (timeLeft <= 0) timeLeft = (640 + timeLeft) % 640;

    setHours(Math.trunc(timeLeft / 60));
    setMins(Math.trunc(timeLeft % 60));
  }


  // Refresh timer
  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => clearInterval(interval);
  }, [hours, mins]);


  // Update localstorage when offset changed
  useEffect(() => {
    localStorage.setItem("farmTickOffset", offset);
    setNewTime();
  }, [offset]);


  // Determine next growth tick in local time
  const timeNow = new Date();
  let localMins = timeNow.getMinutes() + mins;
  let localHours = timeNow.getHours() + hours + Math.trunc(localMins / 60);
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
        <p>Next growth stage in</p>
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
