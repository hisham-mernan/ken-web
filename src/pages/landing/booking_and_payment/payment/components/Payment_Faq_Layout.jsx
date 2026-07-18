import React, { useState } from "react";

// lib
import { useTranslation } from "react-i18next";
import { Accordion, AccordionTab } from "primereact/accordion";

// assets
import { TrailingIcon } from "../../../../../assets/icons/Icon";

const Payment_Faq_Layout = ({ index, children, title, des, img }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIcon = (index) => {
    return activeIndex === index ? (
      <span className="rotate-270 flex_center border-[1.5px] border-[#292D32] w-5 h-5 rounded-lg  ">
        <TrailingIcon fill="#292D32" />
      </span>
    ) : (
      <span className="rotate-90 flex_center border-[1.5px] border-[#292D32] w-5 h-5 rounded-lg   ">
        <TrailingIcon fill="#292D32" />
      </span>
    );
  };

  const onAccordionChange = (e) => {
    setActiveIndex(e.index);
  };
  return (
    <div className="payment_container">
      {" "}
      <Accordion activeIndex={activeIndex} onTabChange={onAccordionChange}>
        <AccordionTab
          key={index}
          header={
            <header className="flex items-center justify-between">
              <div className="flex  items-start gap-7">
                <img src={img} className="w-10 h-10 " alt="icon" />
                <div className="flex gap-2 flex-col">
                  <h4 className="!text-base text-secondary-dark">{t(title)}</h4>
                  <p className="text-secondary-dark text-xs !font-normal ">
                    {t(des)}
                  </p>
                </div>
              </div>
              {toggleIcon(index)}
            </header>
          }
        >
          {children}
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Payment_Faq_Layout;
