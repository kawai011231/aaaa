// import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [prefectures, setPreFectures] = useState([]);
  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => setPreFectures(data.result));
  }, []);
  console.log(prefectures);
  return (
    <div className="App">
      {prefectures.map((prefecture) => (
        <div key={prefecture.prefName}>{prefecture.prefName}</div>
      ))}
    </div>
  );
}

export default App;
