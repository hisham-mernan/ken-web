import React from "react";

// components
import Payment_Form from "./Payment_Form";
import Payment_Faq_Layout from "./Payment_Faq_Layout";

// assets
import {
  BankImgIcon,
  CreditCardIcon,
  WaletWithClockIcon,
  WalletIcon,
} from "../../../../../assets/images/Image";

const list = [
  {
    id: 1,
    img: CreditCardIcon,
    title: "credit_debit_card",
    des: "credit_debit_card_des",
    children: <Payment_Form />,
  },
  {
    id: 1,
    img: WaletWithClockIcon,
    title: "paylater",
    des: "paylater_des",
    children: <Payment_Form />,
  },
];
const Payment_Methods = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-6 xl:gap-[30px]">
      {list?.map((item, index) => (
        <Payment_Faq_Layout
          key={item?.id}
          img={item?.img}
          title={item?.title}
          des={item?.des}
          index={index}
        >
          <Payment_Form />
        </Payment_Faq_Layout>
      ))}
    </div>
  );
};

export default Payment_Methods;
