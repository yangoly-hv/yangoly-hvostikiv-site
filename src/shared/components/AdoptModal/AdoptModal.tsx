import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { IAdoptModalProps } from "@/shared/types";

export default function AdoptModal({
  isOpen,
  onClose,
  translation,
}: IAdoptModalProps) {
  const { adoptButton, adoptDescription, name, connectButton } = translation;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center font-arial font-black text-[24px] leading-[130%] text-[#1D1D1D] uppercase mt-[40px]">
        {adoptButton}
      </h2>
      <p className="text-[14px] lg:text-[16px] leading-[144%] mt-[18px] lg:mt-6 text-center">
        {adoptDescription}
      </p>
      <p className="text-[16px] lg:text-[18px] leading-[130%] mt-6">{name}</p>
      <p className="text-[14px] lg:text-[16px] leading-[130%] mt-2 px-[14px] py-[11px] border border-[#A1A1AA] rounded-[4px]">
        +380 93 098 57 78
      </p>
      <a
        href="tel:+380930985778"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <Button
          onClick={onClose}
          className="mt-6 w-full"
          text={connectButton}
        />
      </a>
    </Modal>
  );
}
