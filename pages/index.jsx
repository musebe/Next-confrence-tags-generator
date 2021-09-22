import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BADGE_FRAME_NAME } from "../lib/constants";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  /**
   * State to hold the how it started image
   * @type {[File,Function]}
   */
  const [thenImage, setThenImage] = useState(null);

  /**
   * State to hold the how it's going image
   * @type {[File,Function]}
   */
  const [nowImage, setNowImage] = useState(null);

  /**
   * State to hold the name of the user
   * @type {[string,Function]}
   */
  const [name, setName] = useState("");

  /**
   * Loading state
   * @type {[boolean,Function]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State to hold the badge frame url
   * @type {[string,Function]}
   */
  const [badgeFrameUrl, setBadgeFrameUrl] = useState("");

  /**
   * State to hold the generated tag url
   * @type {[string,Function]}
   */
  const [tagUrl, setTagUrl] = useState("");

  const checkBadgeFrameExists = useCallback(async () => {
    setLoading(true);

    try {
      // Check if the tag url exists in local storage
      const url = window.localStorage.getItem("tagUrl");

      // If it does, update the tag url state
      if (url) {
        setTagUrl(url);
      }

      // Make GET request to the /api/images endpoint to check if the badge frame exists
      const response = await fetch(`/api/images/${BADGE_FRAME_NAME}`, {
        method: "GET",
      });

      const data = await response.json();

      // Check if the response is a failure
      if (!response.ok) {
        // If the status is 404, the badge frame doesn't exist
        if (response.status === 404) {
          // Make a POST request to the /api/images endpoint to create the badge frame
          const uploadResponse = await fetch(
            `/api/images/${BADGE_FRAME_NAME}`,
            {
              method: "POST",
            }
          );

          const uploadResponseData = await uploadResponse.json();

          if (!response.ok) {
            throw uploadResponseData;
          }

          // Update the badge frame url state
          setBadgeFrameUrl(uploadResponseData.result.secure_url);
        } else {
          throw data;
        }
      }

      // Update the badge frame url state
      setBadgeFrameUrl(data.result.secure_url);
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkBadgeFrameExists();
  }, [checkBadgeFrameExists]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Get the form data
      const formData = new FormData(e.target);

      // Post the form data to the /api/images endpoint
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // Save the tag url to local storage
      window.localStorage.setItem("tagUrl", data.result);

      // Navigate to the tag page
      router.push("/tag");
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="wrapper">
      <Head>
        <title>Create virtual event tag</title>
        <meta name="description" content="Create virtual event tag" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="badge-wrapper">
          <Image
            src="/images/badge-bg.png"
            alt="Badge"
            layout="fixed"
            width={433}
            height={909}
          ></Image>
          <div className="then">
            {thenImage && (
              <Image
                src={URL.createObjectURL(thenImage)}
                alt="Then Image"
                layout="fill"
              ></Image>
            )}
          </div>
          <div className="now">
            {nowImage && (
              <Image
                src={URL.createObjectURL(nowImage)}
                alt="Now Image"
                layout="fill"
              ></Image>
            )}
          </div>
          <p className="name">{name}</p>
        </div>

        <form onSubmit={handleFormSubmit}>
          <p className="heading">Customize your virtual tag</p>
          <div className="input-wrapper">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              id="name"
              required
              autoComplete="name"
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="file-input-wrapper">
            <div className="input-wrapper">
              <label htmlFor="then">
                <div className="upload-img then-img">
                  <Image
                    src="/images/btn-image-upload.svg"
                    alt="image-upload"
                    layout="fixed"
                    width={50}
                    height={50}
                  ></Image>
                </div>
                <p>How it started</p>
              </label>
              <input
                type="file"
                name="then"
                id="then"
                required
                multiple={false}
                accept=".png, .jpg, .jpeg"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files[0];

                  setThenImage(file);
                }}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="now">
                <div className="upload-img now-img">
                  <Image
                    src="/images/btn-image-upload.svg"
                    alt="image-upload"
                    layout="fixed"
                    width={50}
                    height={50}
                  ></Image>
                </div>

                <p>How it&apos;s going</p>
              </label>
              <input
                type="file"
                name="now"
                id="now"
                required
                multiple={false}
                accept=".png, .jpg, .jpeg"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files[0];

                  setNowImage(file);
                }}
              />
            </div>
          </div>
          <p className="instructions">
            We would love to see the journey you have been through. Select two
            photos, one for how it started and another for how it is going.
            Square photos less than 2MB work best.
          </p>
          <button
            type="submit"
            disabled={
              !badgeFrameUrl || !thenImage || !nowImage || !name || loading
            }
          >
            Laminate Tag
          </button>
          {tagUrl && (
            <Link href="/tag" passHref>
              <button>View Your Existing Tag</button>
            </Link>
          )}
        </form>
      </main>
      <style jsx>{`
        div.wrapper {
          height: 100vh;
        }

        main {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          gap: 50px;
          align-items: center;
          min-height: 100%;
          width: 100%;
          background-color: var(--background-color, #132e74);
        }

        main div.badge-wrapper {
          position: relative;
        }
        main div.badge-wrapper div.then {
          position: absolute;
          width: 110px;
          height: 110px;
          top: 478px;
          left: 56px;
        }
        main div.badge-wrapper div.now {
          position: absolute;
          width: 148px;
          height: 148px;
          top: 405px;
          left: 220px;
        }

        main div.badge-wrapper p.name {
          font-family: "Alata", sans-serif;
          width: 80%;
          position: absolute;
          top: 600px;
          left: 50px;
          font-size: 2.6em;
          font-weight: bold;
          line-height: 1.1em;
          color: #ffffff;
          -webkit-text-stroke: 1px black;
          text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
            3px 5px 0 #000;
        }
        main form {
          flex: 1 0 100%;
          background-color: var(--primary-color, #ffee00);
          max-width: 450px;
          min-height: 650px;
          height: 70%;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 8px 8px 0px 0px rgb(0 0 0);
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
        }
        main form p.heading {
          font-family: "Alata", sans-serif;
          font-size: 2em;
          font-weight: 900;
          -webkit-text-stroke: 1px white;
        }
        main form > div.input-wrapper {
          display: flex;
          flex-flow: column nowrap;
        }
        main form > div.input-wrapper label {
          font-weight: 800;
          font-size: 1.5em;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          font-family: "Amatic SC", cursive;
        }
        main form > div.input-wrapper input {
          font-family: "Alata", sans-serif;
          height: 50px;
          padding: 10px;
          border-radius: 5px;
          background-color: #ffffff;
          border: 2px solid #000000;
          font-size: 1.2em;
          font-weight: bold;
          box-shadow: 5px 5px 0px 0px rgb(0 0 0);
        }

        main form > div.file-input-wrapper {
          display: flex;
          flex-flow: row nowrap;
          margin: 40px 0 10px;
        }
        main form > div.file-input-wrapper div.input-wrapper {
          width: 50%;
        }
        main form > div.file-input-wrapper div.input-wrapper label {
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          font-family: "Amatic SC", cursive;
          font-weight: 800;
          font-size: 1.5em;
          letter-spacing: 0.5px;
        }
        main
          form
          > div.file-input-wrapper
          div.input-wrapper
          label
          div.upload-img {
          position: relative;
          width: 60px;
          height: 60px;
          background-color: #ffffff;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        main
          form
          > div.file-input-wrapper
          div.input-wrapper
          label
          div.upload-img.then-img {
          box-shadow: 8px 8px 0px 0px rgb(251 171 42);
        }
        main
          form
          > div.file-input-wrapper
          div.input-wrapper
          label
          div.upload-img.now-img {
          box-shadow: 8px 8px 0px 0px rgb(251 87 171);
        }
        main form > div.file-input-wrapper div.input-wrapper input {
          height: 1px;
          width: 1px;
          visibility: hidden;
        }
        main form p.instructions {
          font-family: "Alata", sans-serif;
          font-size: 1em;
          font-weight: 500;
          text-align: center;
        }
        main form button {
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
        main form button:disabled {
          background-color: #cfcfcf;
        }
        main form button:hover:not([disabled]) {
          background-color: var(--secondary-color, #3658f8);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
