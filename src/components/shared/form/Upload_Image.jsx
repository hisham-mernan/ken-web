import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/Auth_Context";
import { toast } from "react-toastify";
import { PenIcon } from "../../../assets/icons/Icon";
import { Skeleton } from "primereact/skeleton";
import { getInitials } from "../../../utils/getInitials";
import { compressImage } from "../../../utils/compressImage";

// validation
const maxFileSizeInMB = import.meta.env.VITE_REACT_APP_IMAGE_SIZE;
const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;

// The API runs on Vercel, which rejects request bodies over ~4.5 MB at the
// edge with a 413 -- before Django sees them. Files are downscaled below this
// first; anything still over it is refused here rather than failing invisibly.
const HARD_UPLOAD_LIMIT_BYTES = 4 * 1024 * 1024;

const Upload_Image = ({
  value,
  setError,
  error,
  fieldName,
  handleChange,
  disabled,
  loading,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [img, setImg] = useState(null);
  const onFileChange = async (e) => {
    const original = e.target.files[0];
    if (original) {
      const fileType = original.type;

      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        setError(fieldName, {
          type: "manual",
          message: "invalid_file_type",
        });
        toast.error(t("invalid_file_type"));
      } else if (original.size > maxFileSizeInBytes) {
        setError(fieldName, {
          type: "manual",
          message: `${t("file_size_limit")} ${maxFileSizeInMB} MB`,
        });
        toast.error(`${t("file_size_limit")} ${maxFileSizeInMB} MB`);
      } else {
        // Downscale before upload -- the API rejects anything much over 4 MB.
        const file = await compressImage(original);
        if (file.size > HARD_UPLOAD_LIMIT_BYTES) {
          setError(fieldName, {
            type: "manual",
            message: `${t("file_size_limit")} 4 MB`,
          });
          toast.error(`${t("file_size_limit")} 4 MB`);
        } else {
          const blobURL = URL.createObjectURL(file);
          setImg(blobURL);
          handleChange(file);
        }
      }

      e.target.value = null;
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <figure
          className={` relative w-[100px] h-[100px] md:w-[110px] md:h-[110px]  xl:w-[120px] xl:h-[120px] rounded-full  light_shadow ${
            error ? " border border-red-dark" : ""
          }`}
        >
          <Skeleton className="!w-full !h-full !rounded-full " />
        </figure>
      </div>
    );
  }
  return (
    <div className="flex flex-col  gap-2">
      <figure
        className={` border-[3px] relative w-[100px] h-[100px] md:w-[110px] md:h-[110px]   rounded-full   ${
          error ? "  border-red-dark" : "border-[#C9A96E]"
        }`}
      >
        {value || img ? (
          <img loading="lazy" decoding="async"
            src={value && !img ? value : img}
            alt="avatar"
            className="w-full h-full rounded-full object-cover object-center"
          />
        ) : (
          <div className="gold_gradiant flex items-center justify-center rounded-full w-full h-full  ">
            <span className="text-white text-xl font-bold lg:text-2xl 2xl:text-4xl">
              {getInitials(user?.full_name)}
            </span>
          </div>
        )}

        <label
          htmlFor="profile_avatar"
          className=" absolute bottom-0 end-0 flex_center rounded-full w-8 h-8 border-[2px] border-white bg-[#C9A96E] "
        >
          <span
            className={`flex_center w-6 h-6  ${
              disabled ? "" : "cursor-pointer"
            } `}
          >
            <PenIcon />
          </span>
        </label>
      </figure>

      <input
        type="file"
        id="profile_avatar"
        disabled={disabled}
        accept=".jpg,.png"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

export default Upload_Image;
