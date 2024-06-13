import React, { useRef, useEffect, useState } from "react";

interface Props<T> {
  data: T[];
  itemHeight: number;
  extractKey: (item: T) => string | number;
  renderItem: (item: T) => JSX.Element;
  viewPortHeight: number;
}

const VirtualList = <T,>({
  data,
  itemHeight,
  extractKey,
  renderItem,
  viewPortHeight,
}: Props<T>) => {
  //state to render items
  const [visibleData, setVisibleData] = useState<T[]>([]);
  //ref to store container instance
  const containerRef = useRef<HTMLDivElement>(null);

  //finding height of actual rendered data using each item
  const totalHeight = data.length * itemHeight;

  //max = to ensure we do not get less than 0
  //min= to ensure we do not get value higher than data length
  //ciel = t0 to nearest largest integer 4.3 will be 5
  //floor = to get the lowerst integer 4.3 will be 4

  const startIndex = Math.max(
    0,
    Math.floor((containerRef.current?.scrollTop || 0) / itemHeight)
  );

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        //find first and last index to be rendered in viewport
        const start = Math.max(
          0,
          Math.floor(containerRef.current.scrollTop / itemHeight)
        );
        const end = Math.min(
          data.length,
          start + Math.ceil(viewPortHeight / itemHeight)
        );
        // slicing the rows which is currenly presnt in the view port
        setVisibleData(data.slice(start, end));
      }
    };

    //storing the ref into a varible so that while cleanup function it doesn't mess current values
    //however we can use direct ref here but was facing some glitches
    const currentListRef = containerRef.current;
    //attaching listern
    currentListRef?.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      currentListRef?.removeEventListener("scroll", handleScroll); //cleaning the listening to avoid uncessary listerners
    };
  }, [data, itemHeight, viewPortHeight]);

  return (
    <div
      style={{
        height: viewPortHeight,
        ...containerStyle,
      }}
      ref={containerRef}
    >
      <div style={{ height: totalHeight, ...contentWrapperStyle }}>
        {visibleData?.length > 0 ? (
          visibleData?.map((item, index) => {
            const key = extractKey(item); // extracting the unique key 
            const topPos = (startIndex + index) * itemHeight;
            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  top: topPos, // updating the top position
                  height: itemHeight,
                }}
              >
                {renderItem(item)}
              </div>
            );
          })
        ) : (
          <p>no data found</p>
        )}
      </div>
    </div>
  );
};

export default VirtualList;

const containerStyle: React.CSSProperties = {
  overflowY: "auto",
  position: "relative",
};

const contentWrapperStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
};
