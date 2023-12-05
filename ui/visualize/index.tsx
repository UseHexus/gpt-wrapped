"use client";

import React, { useState } from "react";
import WordCloud from "ui/wordcloud";
import HeatMap from "ui/heatmap";
const DAY_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Visualize({ data }) {
  if (!data || !data.userData) {
    return <></>;
  }
  return (
    <>
      <div className="mx-auto  ">
        <div className="relative mb-10  min-h-[240px] text-center">
          <div className="absolute top-0 left-0 flex h-full w-full flex-col content-center items-center  justify-center text-center text-3xl font-bold drop-shadow-lg md:text-8xl">
            <div>GPT Wrapped</div> <div>2023</div>
          </div>
        </div>
        <div className="m-4 flex flex-wrap  justify-center">
          {[
            ["Total number of conversations completed", data.numConversation],
            ["Total number of questions asked", data.userData.questions],
            ["Total number of days you were active", data.userData.numDays],
            [
              " What was your longest streak (in days)?",
              data.userData.longestStreakOfDates,
            ],
            [
              "What day were you the most active?",
              DAY_OF_WEEK[data.userData.activeDays],
            ],
            ["What time were you the chattiest?", data.userData.maxTimeOfDay],
          ].map((value, i) => (
            <div key={i} className=" block  w-96 rounded-lg p-6">
              <h5 className="mb-2 text-2xl font-bold tracking-tight ">
                {value[0]}
              </h5>
              <p className="text-7xl font-normal text-indigo-500 ">
                {value[1]}
              </p>
            </div>
          ))}
        </div>
        <HeatMap data={data?.userData?.dateMap ?? {}} />
        <WordCloud words={data?.textData?.words ?? []} />
        <section className="bg-indigo-600 p-8 py-48 text-lg">
          <div className="mb-4 text-lg">
            <p className="text-xl">
              Did the assistant reply with any of the magical words?{" "}
            </p>
            {Object.entries(data?.userData.replies).map((r: any, i: number) => (
              <div className="mt-4 text-3xl font-normal text-yellow-400">
                {r[0] + " : " + r[1]}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-green-600 p-8 py-48 text-lg">
          <div className="mb-4 text-lg">
            <p className="text-xl"> Were you naughty or nice? </p>

            <p className="mt-4 text-7xl font-normal text-indigo-600">
              Well, you were polite {data.userData.polite} times and said words
              from our <i>unofficial</i> banned list {data.userData.banned}
              times
            </p>
          </div>
        </section>

        <div></div>
      </div>
    </>
  );
}
