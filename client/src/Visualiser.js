import { useEffect } from "react";

export default function Visualizer() {
  useEffect(() => {
    const audio = document.getElementById("audio");
    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }

    draw();
  }, []);

  return null;
}
