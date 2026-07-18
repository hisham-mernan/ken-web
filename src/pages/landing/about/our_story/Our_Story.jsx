import React from "react";
import Special_Landing_Header from "../../../../components/layout/header/Special_Landing_Header";

import Story_Item from "./Story_Item";
import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const Our_Story = () => {
  const { data, loading } = useGetData(API.about.story);
  if (data?.length === 0) {
    return;
  }
  return (
    <section className="flex flex-col gap-16  2xl:gap-[174px] pb-20">
      <Landing_Header title="ken_story" />
      <div className="Container w-full">
        {loading ? (
          <StoryItemSkeleton />
        ) : (
          data?.map((item, index) => (
            <Story_Item
              data={item}
              key={item?.id}
              isLastIndex={data?.length - 1 === index}
              isFirstIndex={index === 0}
            />
          ))
        )}
      </div>
    </section>
  );
};
const StoryItemSkeleton = () => {
  return (
    <section
      className={` grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-2 pb-20`}
    >
      <div className="story_container_content ms-16 flex flex-col justify-center text-center md:text-start max-w-[473px] gap-4 xl:gap-10">
        <header className="flex flex-col gap-3">
          <Skeleton width="100%" height="1rem" className="mx-auto md:mx-0" />
          <Skeleton width="100%" height="1rem" className="mx-auto md:mx-0" />
        </header>
        <div className="flex flex-col gap-3">
          <Skeleton width="100%" height="1rem" className="mx-auto md:mx-0" />
          <Skeleton width="95%" height="1rem" className="mx-auto md:mx-0" />
          <Skeleton width="60%" height="1rem" className="mx-auto md:mx-0" />
        </div>
      </div>
      {/* Image Skeleton */}
      <figure className=" flex  justify-center md:justify-end ms-10 sm:ms-0 relative">
        <Skeleton
          width="300px"
          height="400px"
          className="!rounded-t-full !h-[400px] md:!w-[300px] xs:!h-[450px] md:!h-[400px]"
        />
      </figure>
    </section>
  );
};
export default Our_Story;
