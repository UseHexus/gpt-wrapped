"use client";
import { useEffect, useState } from "react";
import jszip from "jszip";
import ConfettiComponent from "ui/confetti";
import Visualize from "ui/visualize";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { getUserData } from "./gpt_wrapped/utils";
import { getDataAnalysis } from "./gpt_wrapped/text-analysis";
import { useRouter } from "next/navigation";
import LoadingImg from "public/loading.gif";
import Image from "next/image";

async function sendRequest(url: string, arg: any) {
  return fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function Page() {
  const [showViz, setShowViz] = useState(false);
  const [result, setResult] = useState({});
  const [id, setId] = useState({});
  const router = useRouter();

  const save = async function () {
    if (id) {
      router.push("/gpt_wrapped/" + id);
    }
    toast.message("Saving your metadata...");
    //Send request if you want to save the metadata
    const res = await sendRequest("", result);
    if (res.error) {
      toast.error("Could not be saved");
      return;
    } else {
      setId(res.id);
      router.push("/gpt_wrapped/" + res.id);
    }
  };

  function callback(hasFile) {
    if (!hasFile) {
      toast.error("Expected files not found. Is this the correct zip file?");
    }
  }

  const analyzeFile = (e: any) => {
    const file = e.target.files[0];
    let isPresent = false;

    if (file) {
      jszip.loadAsync(file).then(function (zip) {
        setShowViz(false);
        Object.keys(zip.files).forEach(function (filename, index, array) {
          zip.files[filename].async("string").then(function (fileData) {
            let fileDataJson: [];
            if (
              filename === "conversations.json" ||
              filename.endsWith("/conversations.json")
            ) {
              try {
                fileDataJson = JSON.parse(fileData);
                isPresent = true;
                toast.message("File processing...");
              } catch (e) {
                return;
              }
              const userData = getUserData(fileDataJson);
              setResult({
                numConversation: fileDataJson.length,
                userData: userData,
              });
              setShowViz(true);
              const textData = getDataAnalysis(fileDataJson, false);
              setResult((prevState) => ({
                ...prevState,
                textData: textData as any,
              }));
            }
            if (index === array.length - 1) {
              callback(isPresent);
            }
          });
        });
      });
    }
  };

  return (
    <>
      {showViz ? (
        <button
          className=" font-sm fixed top-4 right-4 z-40 items-center  rounded-full bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 hover:text-gray-300 "
          onClick={() => save()}
        >
          Share
        </button>
      ) : (
        <></>
      )}
      <section className="static text-neutral-200 ">
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="pt-36 pb-12 ">
              <div className="pb-4 text-center md:pb-6">
                <h1
                  className="leading-tighter aos-init aos-animate mb-4 text-5xl font-extrabold tracking-tighter text-neutral-200 md:text-6xl"
                  data-aos="zoom-y-out"
                >
                  Your <i>Unofficial </i>
                  <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    {" "}
                    ChatGPT
                  </span>{" "}
                  Year in Review
                </h1>
              </div>

              <div className="text-center text-lg  text-teal-400">
                Think of ChatGPT Wrapped as a reminder of what AI has done for
                you
              </div>
              <div className="mt-8">
                Inspired by Spotify Wrapped, our team at Hexus made this for you
                to recap your ChatGPT usage in 2023.* Download your chat history
                zip and upload it below to get your ChatGPT usage stats. Share
                your stats on social media for some friendly competition.
                #GPTWrapped
              </div>
              <div className="mt-4 text-sm">
                All data is processed only on the client-side. Still concerned
                about your data? Download the code from{" "}
                <a
                  className="text-indigo-400"
                  target="_blank"
                  href="https://github.com/UseHexus/gpt-wrapped"
                >
                  Github
                </a>{" "}
                and run locally. *This project is not affiliated with OpenAI.
              </div>

              <div className="my-16 items-center">
                <form className="flex items-center space-x-6">
                  <div className="shrink-0">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1542810205-0a5b379f9c52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGZ1bnxlbnwwfHwwfHx8MA%3D%3D"
                      alt="add zip file"
                    />
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept=".zip"
                      className="block w-full text-sm text-slate-500
                    file:mr-4 file:rounded-full file:border-0
                    file:bg-violet-50 file:py-2
                    file:px-4 file:text-sm
                    file:font-semibold file:text-violet-700
                    hover:file:bg-violet-100
                  "
                      onChange={analyzeFile}
                    />
                  </label>
                </form>
              </div>
              {showViz ? (
                <>
                  <ConfettiComponent />
                  <Visualize data={result} />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      </section>
    </>
  );
}
