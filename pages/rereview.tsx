import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";

const ReReview: NextPage = () => {
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("roberta");
  const [predictions, setPredictions] = useState<any>();

  var axios = require("axios");
  var data = JSON.stringify({
    data: [input],
  });

  var config = {
    method: "post",
    url: `https://ayaanzaveri-bart-cnn.hf.space/run/predict`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  var config2 = {
    method: "post",
    url: `https://ayaanzaveri-distilbert-base-uncased.hf.space/run/predict`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  useEffect(() => {
    console.log(predictions);
  }, [predictions]);

  async function getPredictions() {
    setPredictions(undefined);
    await axios.all([axios(config), axios(config2)]).then(
      axios.spread(function (response1: any, response2: any) {
        setPredictions({
          summary: response1.data,
          sentiment: response2.data,
          prompt: input,
        });
      })
    );
  }

  console.log(predictions);

  // Paris is the <mask> of France.
  // The largest city in Canada is <mask>.

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-16 py-2 font-sourceSansPro bg-gradient-to-br from-white to-indigo-500/10">
      <div className="flex justify-center flex-col w-11/12 gap-4">
        <span className="text-3xl font-bold text-slate-700 select-none">
          <span className="text-indigo-500">Re</span>
          Review
        </span>
        <div className="flex flex-row w-full">
          <input
            value={input}
            type="text"
            className="rounded-md w-full border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-lg shadow-slate-100 transition duration-300 ease-in-out hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200 active:bg-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            onChange={(e) => setInput(e.target.value)}
            placeholder="ReReview a review... 💫"
          />
          <button
            className="ml-2 select-none px-12 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-100 text-white flex items-center justify-center transition duration-300 ease-in-out hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            onClick={() => getPredictions()}
          >
            <IoSend />
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {predictions && predictions?.sentiment && predictions?.summary ? (
            <div className="flex flex-col gap-3">
              <span className="text-slate-700">
                <b className="text-xl">
                  Review: <br />
                </b>
                {predictions?.prompt}
              </span>
              <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />

              <div className="text-slate-700 w-2/3">
                <b className="text-lg text-indigo-500">
                  Re
                  <span className="text-slate-700">
                    Review: <br />
                  </span>
                </b>
                {predictions?.summary?.data[0]}
              </div>

              <div className="font-bold text-slate-700">
                Overall Sentiment:{" "}
                <span
                  className={`${
                    JSON.parse(
                      predictions?.sentiment?.data[0]?.replaceAll(`'`, `"`)
                    )[0]?.label == "POSITIVE"
                      ? "text-green-500"
                      : "text-red-500"
                  } inline-flex items-center gap-2`}
                >
                  {
                    JSON.parse(
                      predictions?.sentiment?.data[0]?.replaceAll(`'`, `"`)
                    )[0]?.label
                  }
                  <span className="text-slate-600 font-normal text-xs px-1.5 py-0.5 border rounded-md shadow-lg shadow-indigo-500/10">
                    {(
                      JSON.parse(
                        predictions?.sentiment?.data[0]?.replaceAll(`'`, `"`)
                      )[0]?.score * 100
                    ).toFixed(1) + "%"}
                  </span>
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReReview;
