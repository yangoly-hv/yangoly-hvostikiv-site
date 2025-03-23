import Image from "next/image";
import { CloseIcon } from "../../../../public/images/icons";

const LargePhotoModal = ({
  photoSrc,
  onClose,
}: {
  photoSrc: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[90vw] max-w-[800px] h-[90vh] max-h-[600px] rounded-lg overflow-hidden">
        <Image
          src={photoSrc}
          alt="Full-size Image"
          fill={true}
          className="object-cover object-center"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute right-6 top-6 p-2 hover:bg-gray-100 bg-opacity-[1%] rounded-full z-10 transition duration-300 ease-in-out"
        >
          <CloseIcon variant="secondary" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
export default LargePhotoModal;
