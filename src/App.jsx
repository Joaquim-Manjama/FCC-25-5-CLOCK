import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  //Variables
  const [running ,setRunning] = useState(false);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [inBreak, setInBreak] = useState(false);
  const intervalRef = useRef(null);
  const sound = new Audio("sound.mp3")

  //Handle timer logic
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(seconds + 59);
          } else if (minutes === 0) {
            if (inBreak) {
              setInBreak(false);
              setMinutes(sessionLength);
              setSeconds(0);

            } else {
              setInBreak(true);
              setMinutes(breakLength);
              setSeconds(0);
            }
          }
        } else {
          if (seconds === 1 && minutes === 0) document.getElementById("beep").play();
          setSeconds(seconds - 1);
        }
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [running, minutes, seconds]);

  //Keep track of change in session length
  useEffect(() => {
    setMinutes(sessionLength);

  },[sessionLength]);

  //Reset components
  const reset = () => {
    setRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setMinutes(25);
    setSeconds(0);
    setInBreak(false);
    document.getElementById("beep").pause()
    document.getElementById("beep").currentTime = 0;
  }

  //Formating the seconds
  const format = (val) => val >= 10? `${val}`: `0${val}`; 

  //Incrementing a state
  const increment = (state, reducer) => {
    if (state < 60) reducer(state + 1);
  }

  //Decrementing a state
  const decrement = (state, reducer) => {
    if (state > 1) reducer(state - 1); 
  }

  //Handle option actions
  const handleOptions = (action) => {
    if (running) return;

    switch(action) {
      case 'break-decrement':
        decrement(breakLength, setBreakLength);
        break;

      case 'break-increment':
        increment(breakLength, setBreakLength);
        break;

      case 'session-decrement':
          decrement(sessionLength, setSessionLength);
          break;

      case 'session-increment':
          increment(sessionLength, setSessionLength);
          break;

      default:
        break;
    }
  }

  return (
    <div className='container'>
      <div className='options' onClick={(event) => handleOptions(event.target.id)}>
        <div id='break-label'>
          <span>Break Length</span><span><span id='break-decrement' className='arrow'>↓</span><span id='break-length'>{breakLength}</span><span id='break-increment' className='arrow'>↑</span></span>
        </div>
        <div id='session-label'>
          <span>Session Length</span><span><span id='session-decrement' className='arrow'>↓</span><span id='session-length'>{sessionLength}</span><span id='session-increment' className='arrow'>↑</span></span>
        </div>
      </div>
      <div id='timer-label' className={minutes === 0 || inBreak? 'red': ''}>
        <span>{inBreak?'Break':'Session'}</span>
        <span id='time-left'>{format(minutes)}:{format(seconds)}</span>
      </div>
      <div className='actions'>
        <i id='start_stop' className='icon' onClick={() => setRunning(!running)}>{ running ? <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'><path d='M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z'/></svg>:<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path d='M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z'/></svg>}</i>
        <i id='reset' className='icon' onClick={() => reset()}><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z'/></svg></i>
      </div>
      <audio id="beep" src='https://cdn.pixabay.com/audio/2022/03/15/audio_32283e5329.mp3'></audio>
    </div>
  )
}

export default App;
