import logo from "./logo.svg";
import "./App.css";
import BrowsePage from "./components/BrowsePage";
import VideoCardGrid from "./layouts/VideoCardGrid";

function App() {
  return (
    <div className="App">
      <BrowsePage />
      <VideoCardGrid />
    </div>
  );
}

export default App;
