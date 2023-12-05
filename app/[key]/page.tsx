"use client";
import Visualize from "ui/visualize";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { BsLinkedin, BsFacebook, BsReddit } from "react-icons/bs";
import { FaSquareXTwitter } from "react-icons/fa6";

async function jsonFetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  if (!res.ok) {
    return JSON.parse('{"error":true}');
  }
  return res.json();
}
export default function Page({ params }: { params: { key: string } }) {
  const [url, setUrl] = useState(
    typeof window !== "undefined"
      ? window.location.href
      : "https://hexus.ai/gpt_wrapped/",
  );
  const router = useRouter();
  const { data, error, isLoading } = useSWRImmutable(
    params.key && params.key.length > 0 ? `#ADD_API` : null,
    jsonFetcher,
  );
  useEffect(() => {
    if (error || (data && (data as any).error)) {
      return router.push("/");
    }
  }, [data, error, isLoading]);

  return (
    <>
      <a
        className="font-sm fixed top-4 right-40 z-40 items-center   rounded-full  px-3 py-2 text-sm"
        href={`  https://www.reddit.com/submit?url=${url}`}
        target="_blank"
      >
        <BsReddit
          size={24}
          className="w-16 text-gray-300 hover:text-[#1BA0F4]"
        />
      </a>

      <a
        className="font-sm fixed top-4 right-28 z-40 items-center   rounded-full  px-3 py-2 text-sm"
        href={`  https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
      >
        <BsFacebook
          size={24}
          className="w-16 text-gray-300 hover:text-[#1BA0F4]"
        />
      </a>
      <a
        className="font-sm fixed top-4 right-16 z-40 items-center   rounded-full  px-3 py-2 text-sm"
        href={` https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
      >
        <BsLinkedin
          size={24}
          className="w-16 text-gray-300 hover:text-[#1BA0F4]"
        />
      </a>

      <a
        className="font-sm fixed top-4 right-4 z-40 items-center   rounded-full  px-3 py-2 text-sm"
        href={` https://twitter.com/intent/tweet?text=${
          url + " " + "#GPTWrapped"
        }`}
        target="_blank"
      >
        <FaSquareXTwitter
          size={24}
          className="w-16 text-gray-300 hover:text-[#1BA0F4]"
        />
      </a>
      {isLoading ? (
        <></>
      ) : (
        <section className="static text-neutral-200 ">
          <Visualize data={data} />
        </section>
      )}
    </>
  );
}
