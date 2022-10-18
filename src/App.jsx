import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

function App() {
  // 都道府県一覧
  const [prefectures, setPreFectures] = useState([]);
  // チェックされた都道府県一覧
  const [checkedPrefs, setCheckedPrefs] = useState([]);
  // 都道府県のデータ
  const [prefData, setPrefData] = useState({});
  // チェックされた都道府県一覧
  const [checkedDatas, setCheckedDatas] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => setPreFectures(data.result));
    fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=0`,
      {
        headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data.result.data[0].data;
      })
      .then((data) => {
        const categorieData = data.map((item) => {
          return item.year;
        });
        setCategory(categorieData);
        const arrayData = data.map((item) => {
          return item.value;
        });
        return arrayData;
      })
      .then((data) => {
        const aaa = [
          {
            index: 0,
            name: "日本",
            data: data,
          },
        ];
        return aaa;
      })
      .then((data) => {
        setCheckedDatas(data);
      });
  }, []);

  const options = {
    title: {
      text: "総人口推移",
    },
    xAxis: {
      title: {
        text: "年度",
      },
      categories: category,
    },
    yAxis: {
      title: {
        text: "人口数",
      },
    },
    series: checkedDatas,
  };

  const handleClick = (e) => {
    const prefectureNumber = Number(e.target.value - 1);
    const prefectureName = prefectures[prefectureNumber].prefName;
    if (checkedPrefs.includes(prefectureNumber)) {
      setCheckedPrefs(checkedPrefs.filter((pref) => pref !== prefectureNumber));
      setCheckedDatas(
        checkedDatas.filter(
          (checkedData) => checkedData.index !== prefectureNumber + 1
        )
      );
    } else {
      setCheckedDatas(
        checkedDatas.filter((checkedData) => checkedData.index !== 0)
      );
      setCheckedPrefs([...checkedPrefs, prefectureNumber]);
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${
          prefectureNumber + 1
        }`,
        {
          headers: { "X-API-KEY": process.env.REACT_APP_API_KEY },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data.result.data[0].data;
        })
        .then((data) => {
          let arrayData = data.map((item) => {
            return item.value;
          });
          return arrayData;
        })
        .then((data) => {
          setPrefData({
            index: prefectureNumber + 1,
            name: prefectureName,
            data: data,
          });
        });
    }
  };
  useEffect(() => {
    setCheckedDatas([...checkedDatas, prefData]);
  }, [prefData]);
  return (
    <div className="App">
      <ul>
        {prefectures.map((prefecture) => (
          <li key={prefecture.prefCode}>
            <label>
              <input
                type="checkbox"
                onClick={handleClick}
                value={prefecture.prefCode}
              />
              {prefecture.prefName}
            </label>
          </li>
        ))}
      </ul>
      {checkedPrefs.map((checkedPref) => (
        <p key={checkedPref}>{checkedPref}</p>
      ))}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default App;
