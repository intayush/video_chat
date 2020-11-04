import { useEffect, useState } from "react";
import {
    MuteIcon,
    UnmuteIcon,
    VideoOff,
    VideoOn,
    ProfileIcon,
    PhoneIcon,
} from "../Icons";
import EnablexIcon from "../assets/enableX_logo.png";
import { useHistory } from "react-router-dom";

function Meeting() {
    const history = useHistory();
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    useEffect(() => {
        //on first render
        //select video and audio elements
        const videos = document.querySelectorAll("video");
        const audio = document.querySelector("audio");
        //function to resize video element according to window height
        function resizeVideoElements() {
            const windowHeight = window.innerHeight;
            document
                .querySelectorAll(".video-placeholder")
                .forEach((element) => {
                    element.style.height = windowHeight + "px";
                });
            // set height accrding to screen resolution
            videos.forEach((video) => {
                video.style.height = windowHeight + "px";
            });
        }

        function handleSuccess(stream) {
            stream.oninactive = function () {
                console.log("Stream ended");
            };
            // set the source stream for both video elements
            videos.forEach((video) => {
                video.srcObject = stream;
            });
            // set audio element source stream
            audio.srcObject = stream;
            // set the captured stream to window object to handle enable/disable of both streams globally
            window.stream = stream;
            setIsAudioEnabled(false);
            setIsVideoEnabled(true);
        }

        function handleError(error) {
            const errorMessage =
                "navigator.MediaDevices.getUserMedia error: " +
                error.message +
                " " +
                error.name;
            document.getElementById("errorMsg").innerText = errorMessage;
            console.log(errorMessage);
        }
        const audioVideoConstraints = (window.constraints = {
            audio: true,
            video: true,
        });

        //get audio/video media device access from browser
        navigator.mediaDevices
            .getUserMedia(audioVideoConstraints)
            .then(handleSuccess)
            .catch(handleError);

        resizeVideoElements();
        window.addEventListener("resize", resizeVideoElements);

        //stop all tracks before component unmounts
        return () => {
            window.stream.getTracks().forEach((track) => track.stop());
        };
    }, []);

    const toggleAudio = () => {
        //toggle the audio stream of the window
        window.stream.getAudioTracks().forEach((stream) => {
            stream.enabled = !stream.enabled;
            //change the color of control button
            const audioControl = document.querySelector(".audio-control");
            if (stream.enabled) {
                audioControl.classList.remove("bg-red");
                audioControl.classList.add("bg-white");
            } else {
                audioControl.classList.remove("bg-white");
                audioControl.classList.add("bg-red");
            }
        });
        setIsAudioEnabled(!isAudioEnabled);
    };

    const toggleVideo = () => {
        //toggle the video stream of the window
        window.stream.getVideoTracks().forEach((stream) => {
            stream.enabled = !stream.enabled;
        });
        //change the color of control button
        const videoControl = document.querySelector(".video-control");
        if (isVideoEnabled) {
            videoControl.classList.remove("bg-white");
            videoControl.classList.add("bg-red");
        } else {
            videoControl.classList.remove("bg-red");
            videoControl.classList.add("bg-white");
        }
        setIsVideoEnabled(!isVideoEnabled);
    };

    const endCall = () => {
        history.push("/?leave");
    };
    return (
        <div className="App">
            <div id="logoContainer">
                <img src={EnablexIcon} alt="" />
            </div>
            <div className="video-container">
                <video
                    id="video1"
                    poster={MuteIcon}
                    autoPlay
                    style={{ display: isVideoEnabled ? "block" : "none" }}
                />
                <div
                    className="video-placeholder"
                    style={{
                        display: isVideoEnabled ? "none" : "flex",
                    }}
                >
                    <ProfileIcon />
                    <p>Video Disabled</p>
                </div>
            </div>
            <div className="video-container">
                <video
                    id="video2"
                    autoPlay
                    style={{ display: isVideoEnabled ? "block" : "none" }}
                />
                <div
                    className="video-placeholder"
                    style={{
                        display: isVideoEnabled ? "none" : "flex",
                    }}
                >
                    <ProfileIcon />
                    <p>Video Disabled</p>
                </div>
            </div>
            <audio autoPlay></audio>
            <div className="control-buttons-container">
                <span
                    className="control-button bg-white audio-control"
                    onClick={toggleAudio}
                >
                    {isAudioEnabled ? <MuteIcon /> : <UnmuteIcon />}
                </span>
                <span className="control-button bg-red" onClick={endCall}>
                    <PhoneIcon />
                </span>
                <span
                    className="control-button bg-white video-control"
                    onClick={toggleVideo}
                >
                    {isVideoEnabled ? <VideoOff /> : <VideoOn />}
                </span>
            </div>
        </div>
    );
}

export default Meeting;
