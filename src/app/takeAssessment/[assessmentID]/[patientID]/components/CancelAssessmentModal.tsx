import {useParams, useRouter} from "next/navigation";
import {useCallback, useEffect} from "react";

interface ModalProps {
  onClose: () => void;
}

export default function CancelAssessmentModal({onClose}: ModalProps) {
  // Use useCallback to memoize the handlera
  const router = useRouter();

  const {assessmentID, patientID} = useParams();
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).id === "modal-overlay") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    // Function to handle key press
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Add event listener for escape key
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(`/takeAssessment/${assessmentID}/${patientID}/interrupted`);
  };

  return (
    <>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={handleOverlayClick}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-[var(--text-color)]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 text-center"
          >
            <div className="text-xl font-bold">
              Are you sure you want to cancel this assessment?
            </div>
            <div className="flex justify-center space-x-4">
              <button className="bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300">
                Yes
              </button>
              <button
                type="submit"
                className="bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300"
                onClick={onClose}
              >
                No
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
