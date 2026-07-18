import { useState } from "react";
import { StarIcon, StarIconFill } from "../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../utils/switchLang";
import { useTranslation } from "react-i18next";

const StareRate = ({
  containerClassName = "",
  starWidth = "30",
  starHeight = "30",
  defaultRating = 0,
  onSetRating,
  des,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const handleRating = (rating) => {
    setRating(rating);
    onSetRating && onSetRating(rating);
  };
  return (
    <div className="flex items-center justify-center text-center flex-col gap-8">
      <ul className={`flex items-center gap-[10px] ${containerClassName}`}>
        {[...Array(5)].map((_, index) => (
          <li
            className="cursor-pointer"
            key={index}
            onClick={() => handleRating(index + 1)}
            onMouseEnter={() => setTempRating(index + 1)}
            onMouseLeave={() => setTempRating(0)}
          >
            {rating >= index + 1 || tempRating >= index + 1 ? (
              <StarIconFill width={starWidth} height={starHeight} />
            ) : (
              <StarIcon width={starWidth} height={starHeight} />
            )}
          </li>
        ))}
      </ul>
      {des && (
        <p
          className="text-primary2 title_lg"
          dangerouslySetInnerHTML={{ __html: t(des) }}
        ></p>
      )}
    </div>
  );
};

export default StareRate;
