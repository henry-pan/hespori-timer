import React, { useState, useEffect } from "react";

export default function App() {
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = 640 - (((Date.now() / 1000) / 60) % 640);
      setHours(Math.trunc(timeLeft / 60));
      setMins(Math.trunc(timeLeft % 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [hours, mins]);


  return (
    <div className="content">
      <header>
        <h1>Hespori Timer</h1>
      </header>
      <section>
        <h2>Next growth stage in</h2>
        <h2>{hours} hours, {mins} minutes</h2>
      </section>
    </div>
  );
}
