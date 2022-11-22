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
    <div className="flex min-h-screen flex-col items-center justify-start pt-16 py-2 font-sourceSansPro bg-gradient-to-br from-white to-green-500/10">
      <div className="flex justify-center flex-col w-11/12 gap-4">
        <span className="text-3xl font-bold text-slate-800 select-none">
          <span className="text-green-500">Re</span>
          Review
        </span>
        <div className="flex flex-row w-full">
          <input
            value={input}
            type="text"
            className="rounded-md w-full border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-lg shadow-slate-100 transition duration-300 ease-in-out hover:bg-slate-50 focus:border-green-500 focus:outline-none focus:ring focus:ring-green-200 active:bg-green-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            onChange={(e) => setInput(e.target.value)}
            placeholder="ReReview a review... 💫"
          />
          <button
            className="ml-2 select-none px-12 rounded-lg bg-green-500 shadow-lg shadow-green-100 text-white flex items-center justify-center transition duration-300 ease-in-out hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-200"
            onClick={() => getPredictions()}
          >
            <IoSend />
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {predictions && predictions?.sentiment && predictions?.summary ? (
            <div className="flex flex-col gap-3">
              <span className="text-slate-700">
                <b className="text-lg">
                  Review: <br />
                </b>
                {predictions?.prompt}
              </span>
              <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="text-slate-800 w-2/3">
                <b className="text-lg text-green-600">
                  Re
                  <span className="text-slate-800">
                    Review: <br />
                  </span>
                </b>
                {predictions?.summary?.data[0]}
              </span>
              <br />
              Sentiment: {JSON.stringify(predictions?.sentiment?.data[0]?.replace(/'/g, '"'))?.label}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReReview;
