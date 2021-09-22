import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Tag() {
  /**
   * State to hold the generated tag url
   * @type {[string,Function]}
   */
  const [tagUrl, setTagUrl] = useState("");

  /**
   * Loading state
   * @type {[boolean,Function]}
   */
  const [loading, setLoading] = useState(false);

  const getTag = useCallback(() => {
    try {
      setLoading(true);

      // Get the tag url from local storage
      const url = window.localStorage.getItem("tagUrl");

      // If the url is not empty, update the state
      if (url) {
        setTagUrl(url);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTag();
  }, [getTag]);

  const handleDownloadResource = async () => {
    try {
      setLoading(true);

      const response = await fetch(tagUrl, {});

      if (response.ok) {
        const blob = await response.blob();

        const fileUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `my-virtual-tag.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      throw await response.json();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="flex-wrapper">
          {!loading && tagUrl && (
            <div className="tag">
              <div className="tag-image">
                <Image
                  src={tagUrl}
                  alt="Virtual Tag"
                  layout="intrinsic"
                  width={433}
                  height={909}
                ></Image>
              </div>
              <div className="share-sheet">
                <p>
                  Here is your tag. You can download it and share it with your
                  friends.
                </p>
                <button
                  onClick={() => {
                    handleDownloadResource();
                  }}
                >
                  Download Tag
                </button>

                <Link href="/" passHref>
                  <button>Back to home</button>
                </Link>
              </div>
            </div>
          )}
          {loading && (
            <div className="loading">
              <p>Loading...</p>
              <p>Please be patient</p>
            </div>
          )}
          {!loading && !tagUrl && (
            <div className="no-tag">
              <p>
                You have not yet generated a tag or you cleared your browser
                storage and we have lost it.
              </p>
              <Link href="/" passHref>
                <button>Create Tag</button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        main {
          min-height: 100vh;
          width: 100vw;
          background-color: var(--background-color);
        }
        main div.flex-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        main div.flex-wrapper div.tag {
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          align-items: center;
          gap: 50px;

          display: flex;
        }
        main div.flex-wrapper div.tag div.tag-image {
          position: relative;
          height: 100vh;
          max-width: 400px;
        }

        main div.flex-wrapper div.tag div.share-sheet,
        main div.flex-wrapper div.no-tag,
        main div.flex-wrapper div.loading {
          max-width: 600px;
          margin: auto;
          padding: 80px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          background-color: var(--primary-color);
          border-radius: 20px;
          box-shadow: 8px 8px 0px 0px rgb(0 0 0);
        }

        main div.flex-wrapper div.tag div.share-sheet p,
        main div.flex-wrapper div.no-tag p,
        main div.flex-wrapper div.loading p {
          font-family: "Alata", sans-serif;
          font-size: 1em;
          font-weight: 500;
          text-align: center;
        }

        main div.flex-wrapper div.tag div.share-sheet {
          max-width: 450px;
          margin: 0;
        }

        main button {
          background-color: #ffffff;
          width: fit-content;
          height: 50px;
          padding: 10px 20px;
          border-radius: 5px;
          font-family: "Alata", sans-serif;
          font-size: 1.5em;
          font-weight: bold;
          margin: 10px auto;
          box-shadow: 5px 5px 0px 0px rgb(0 0 0);
        }
        main button:disabled {
          background-color: #cfcfcf;
        }
        main button:hover:not([disabled]) {
          background-color: var(--secondary-color);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
