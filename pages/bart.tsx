import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";

const Bart: NextPage = () => {
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

  useEffect(() => {
    console.log(predictions);
  }, [predictions]);

  async function getPredictions(data: any) {
    try {
      const response = await axios(config);
      setPredictions({ ...response.data, prompt: input });
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
          <span className="text-sky-500">Li</span>
          bert
          <span className="text-sky-500">y</span>
        </span>
        <div className="flex flex-row w-full">
          <textarea
            value={input}
            rows={5}
            className="rounded-md w-full border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-lg shadow-slate-100 transition duration-300 ease-in-out hover:bg-slate-50 focus:border-sky-500 focus:outline-none focus:ring focus:ring-sky-200 active:bg-sky-100"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 select-none px-6 rounded-lg bg-sky-500 shadow-lg shadow-sky-100 text-white flex items-center justify-center transition duration-300 ease-in-out hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-200"
            onClick={() => getPredictions(input)}
          >
            <IoSend />
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {predictions ? (
            <div className="flex flex-row gap-3">
              <span className="text-slate-700 bg-slate-50 rounded-lg border p-5">{predictions?.prompt}</span>
              <span className="text-sky-600 bg-slate-50 rounded-lg border p-5">{predictions?.data[0]}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Bart;
