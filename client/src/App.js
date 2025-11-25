import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let audioCtx = null;

    const setupAudio = () => {
      if (!audioCtx) {
        audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        analyserRef.current = analyser;

        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
    };

    const draw = () => {
      requestAnimationFrame(draw);

      if (!analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const barWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = "rgb(" + barHeight + ",50,50)";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth;
      }
    };

    draw();

    audio.addEventListener("play", setupAudio);

    return () => {
      audio.removeEventListener("play", setupAudio);
    };
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const audio = audioRef.current;

    // URL.createObjectURL works for files.
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.play();
  };

  return (
    <div className="App">
      <h1>Music Visualizer (Minimal Version)</h1>

      <input type="file" accept="audio/*" onChange={handleFile} />

      <audio ref={audioRef} controls style={{ marginTop: "20px" }} />

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{
          width: "90%",
          border: "1px solid white",
          marginTop: "20px",
        }}
      />
    </div>
  );
}

export default App;
