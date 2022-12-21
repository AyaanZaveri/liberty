import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("roberta");
  const [predictions, setPredictions] = useState<any>();

  var axios = require("axios");
  var data = JSON.stringify({
    data: [input],
  });

  var config = {
    method: "post",
    url: `https://ayaanzaveri-roberta.hf.space/run/predict`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  useEffect(() => {
    console.log(predictions);
  }, [predictions]);

  async function getPredictions(data: any) {
    try {
      const response = await axios(config);
      setPredictions({...response.data, prompt: input});
    } catch (error) {
      console.log(error);
    }

    console.log(predictions);
  }

  // Paris is the <mask> of France.
  // The largest city in Canada is <mask>.

  return (
    <div className="flex min-h-screen flex-col items-center justify-start mt-16 py-2 font-inter">
      <div className="flex justify-center flex-col w-10/12 gap-4">
        <span className="text-3xl font-bold text-slate-800 select-none">
          <span className="text-amber-500">Li</span>
          bert
          <span className="text-amber-500">y</span>
        </span>
        <div className="flex flex-row w-full">
          <input
            value={input}
            type="text"
            className="rounded-md w-full border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-lg shadow-slate-100 transition duration-300 ease-in-out hover:bg-slate-50 focus:border-amber-500 focus:outline-none focus:ring focus:ring-amber-200 active:bg-amber-100"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 select-none px-10 rounded-lg bg-amber-500 shadow-lg shadow-amber-100 text-white flex items-center justify-center transition duration-300 ease-in-out hover:bg-amber-600 active:bg-amber-700 focus:outline-none focus:ring focus:ring-amber-200"
            onClick={() => getPredictions(input)}
          >
            Send
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {predictions?.data[0]?.confidences?.map((prediction: any) => (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-800">
                {prediction?.label}
              </span>
              <span
                className="text-xs text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: predictions?.prompt?.replace(
                    "<mask>",
                    `<span class="font-semibold">${prediction?.label}</span>`
                  ),
                }}
              ></span>
              <div className="flex flex-row gap-2 items-center">
                <div className="w-2/3">
                  <div className="w-full bg-slate-100 flex flex-row rounded-lg">
                    <div
                      className="bg-gradient-to-r from-amber-400 bg-amber-500 h-1 rounded-full shadow-lg shadow-blue-500"
                      style={{
                        width: `${prediction?.confidence * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-slate-600 select-none">
                  {(prediction?.confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
