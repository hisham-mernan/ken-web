import React, { useEffect, useState } from "react";

const Counter = ({
  handleChange,
  disabled = false,
  max,
  value,
  textClassName = "",
}) => {
  const [count, setCount] = useState(value);

  const handleChangeCounter = (action) => {
    if (action === "inc") {
      setCount((pre) => {
        let value = pre;
        if (max && pre >= max) {
          value = max;
        } else {
          value = pre + 1;
        }
        if (handleChange) {
          handleChange(value);
        }
        return value;
      });
    } else if (action === "dec") {
      setCount((pre) => {
        let value = pre;
        if (pre > 0) {
          value = pre - 1;
        } else {
          value = 0;
        }
        if (handleChange) {
          handleChange(value);
        }
        return value;
      });
    }
  };
  useEffect(() => {
    setCount(value);
  }, [value]);
  return (
    <div className="flex_center_y gap-1 flex-row-reverse">
      <span
        onClick={() => handleChangeCounter("inc")}
        className={`flex_center pb-[.8px] w-4 h-4 rounded-full bg-primary-light text-white text-sm font-semibold ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        +
      </span>
      <input
        type="number"
        min={0}
        value={count}
        disabled={disabled}
        className={`w-[25px]  ${textClassName} text-center outline-none shadow-none text-sm`}
        onChange={(e) =>
          setCount((pre) => {
            let value = e.target.value;
            let c = 0;
            if (!value || value < 0) {
              c = 0;
            } else if (max && value > max) {
              c = max;
            } else {
              c = value;
            }
            return c;
          })
        }
      />
      <span
        onClick={() => handleChangeCounter("dec")}
        className={`flex_center w-4 h-4 rounded-full bg-primary-light text-white text-sm font-semibold ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        -
      </span>
    </div>
  );
};

export default Counter;
