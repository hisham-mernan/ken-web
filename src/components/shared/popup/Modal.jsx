import React from "react";
import { Dialog } from "primereact/dialog";
import { CloseCircleIconOutline } from "../../../assets/icons/Icon";
const Modal = ({
  open,
  onClose,
  children,
  className = "",
  hide_close = false,
  loading = false,
  childrentClassName = "",
}) => {
  return (
    <Dialog
      visible={open}
      onHide={() => {
        if (!loading) {
          onClose();
        }
      }}
      dismissableMask
      draggable={false}
      className={`${className} bg-white ${
        hide_close ? "modal_hide_header" : ""
      }  max-w-[95%] w-[701px] modal rounded-lg ${
        loading ? "not_allow_svg" : ""
      } `}
    >
      <div
        className={`flex flex-col justify-center items-center ${childrentClassName}`}
      >
        {children}
      </div>
    </Dialog>
  );
};

export default Modal;
