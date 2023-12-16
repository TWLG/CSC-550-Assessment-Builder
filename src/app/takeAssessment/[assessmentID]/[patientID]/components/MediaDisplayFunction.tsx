import React, {useState, useEffect} from "react";
import {getStorage, ref, getDownloadURL} from "firebase/storage";

const ImageDisplayFunction = ({
  assessmentID,
  mediaName,
  type,
}: {
  assessmentID: string;
  mediaName: string;
  type: string;
}) => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [error, setError] = useState(""); // State to hold error message

  useEffect(() => {
    const loadMedia = async () => {
      if (mediaName) {
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `Assessments/${assessmentID}/${mediaName}`
        );

        try {
          console.log("ImageDisplayFunction Fetch");

          const url = await getDownloadURL(imageRef);
          setMediaUrl(url);
          setError(""); // Reset error state on successful load
        } catch (error) {
          setMediaUrl(""); // Reset imageUrl on error
          setError("Image not found"); // Set error state
        }
      }
    };

    loadMedia();
  }, [assessmentID, mediaName]); // Include assessmentID in the dependency array

  if (error) {
    return (
      <div>
        {error}: {mediaName}
      </div>
    );
  }

  return (
    <>
      {type === "image" && (
        <>{mediaUrl && <img src={mediaUrl} alt={mediaName} />}</>
      )}
      {type === "video" && (
        <>
          {mediaUrl && (
            <video
              controls
              ref={(video) => {
                if (video) {
                  video.volume = 0.2;
                }
              }}
              className="object-contain"
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          )}
        </>
      )}
    </>
  );
};

export default ImageDisplayFunction;
