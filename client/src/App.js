import "./App.css";
import Visualizer from "./Visualiser";

function App() {
  const handleFile = (e) => {
    const file = e.target.files[0];
    const audio = document.getElementById("audio");
    audio.src = URL.createObjectURL(file);
    audio.play();
  };

  return (
    <div className="App">
      <h1>Music Visualizer</h1>

      <input type="file" accept="audio/*" onChange={handleFile} />

      <audio id="audio" controls></audio>

      <canvas id="visualizer" width="800" height="400"></canvas>

      <Visualizer />
    </div>
  );
}

export default App;
