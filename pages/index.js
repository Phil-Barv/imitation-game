import * as faceapi from '../face-api.min.js';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

const Index = () => {

    const affirmations = [
        "Amazing!",
        "Good job.",
        "You are doing so well.",
        "Nice",
        "Cool moves",
        "Shway!",
      ];

    const [visible, setVisible] = useState(false);

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function get_affirmation (list) {
    return list[Math.floor((Math.random()*list.length))];
    }

    const handleAffirmation = async () => {
        setVisible(get_affirmation(affirmations));
        await sleep(3000);
        setVisible();
    }

    const [borderSetting, setBorderSetting] = useState("");
    const [emotion, setEmotion] = useState();
    const [currEmotion, setCurrEmotion] = useState("");
    const [selectEmotion, setSelectEmotion] = useState("");
    const [currentView, setCurrentView] = useState(0);
    // const [toggle, setToggle] = useState(false);
    const theme = "lime green";
 
    // const handleChangeToggle = () => {
    //     setToggle(!toggle);
    //     if (toggle) {
    //         setTheme('blue')
    //     } else {
    //         setTheme('lime green')
    //     }
    //   }

    const handleChangeEmotion = (event) => {
        setSelectEmotion(event.target.value);
    }

    const handleChangeView = (val) => {
        setCurrentView(val);
    }

    const handlePageRefresh = () => {
        window && window.location.reload();
    }

    useEffect(() => {
        Webcam()
    }, [currentView])

    async function Webcam() {

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/static/models')
            ]).then(startVideo)

        const video = document.getElementById("video");

        function startVideo() {
            video && navigator.getUserMedia(
                { video: {} },
                stream => video.srcObject = stream,
                err => console.error(err)
            )
        }
            video?.addEventListener('play', () => {
                const canvas = faceapi.createCanvasFromMedia(video)
                canvas.style.position = "absolute";
                document.body.append(canvas)
                const displaySize = { width: video.width, height: video.height }
                faceapi.matchDimensions(canvas, displaySize)
                
                setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                    // const resizedDetections = faceapi.resizeResults(detections, displaySize)
                    setEmotion(detections && detections[0]?.expressions || "Neutral");
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    // faceapi.draw.drawDetections(canvas, resizedDetections)
                    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
                }, 100)
            })
    }

    useEffect(() => {

        if (emotion) {
            var result = Object.entries(emotion).reduce((a, emotion) => a[1] > emotion[1] ? a : emotion)[0];
            if (result == "2") {
                result = "neutral"
            }
            setCurrEmotion(result)
        }
    }, [emotion])


    useEffect(() => {
        if (currEmotion.toLocaleLowerCase() == selectEmotion.toLocaleLowerCase()) {
            setBorderSetting(`2px solid limegreen`);  
        } else {
            setBorderSetting("none");
        }
    })

    return (
        <>
            {currentView == 0 && (
                <>
                    <div style={{width:"50vh", height:"50vh", border:"2px solid limegreen", borderRadius:"13px", margin:"30px", padding:"30px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        <h1 style={{marginTop:"0px", color:"blue", textShadow:"1px 1px black"}}>
                            Monkey See
                        </h1>
                        <div style={{height:"10px"}}></div>
                        <select 
                            style={{textAlign:"center", width:"50%", height:"12.5%", borderRadius:"13px", border:"2px solid gray", color:"black"}}
                            value={selectEmotion} 
                            onChange={handleChangeEmotion} 
                            name='selectEmotion'
                            required>
                                <option value="Emotion" selected >Emotion</option>
                                <option value="Happy">Happy</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Sad">Sad</option>
                                <option value="Surprised">Surprised</option>
                                <option value="Disgusted">Disgusted</option>
                                <option value="Angry">Angry</option>
                                <option value="Fearful">Fearful</option>
                        </select>
                        <h1 style={{marginTop:"30px", color:"blue", textShadow:"1px 1px black"}}>
                            Monkey Do
                        </h1>
                        <div style={{height:"10px"}}></div>
                        <button
                            disabled={!selectEmotion || selectEmotion == "Emotion"}
                            style={{width:"50%", height:"12.5%", padding:"0px 15px", borderRadius:"13px", cursor:"pointer", border:"2px solid gray", color:"black"}}
                            onClick={()=> {handleChangeView(1)}}
                        >
                            {selectEmotion || "Emotion"}
                        </button>
                    </div>
                </>
            )}
            {currentView == 1 && (
                <div>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <h2 style={{textShadow:"1px 1px black", padding:"0", margin:"0", marginBottom:"15px", color:`${currEmotion.toLocaleLowerCase() == selectEmotion.toLocaleLowerCase() && theme || "gray"}`}}>
                            {currEmotion.toUpperCase()}
                        </h2>
                    </div>
                        <video style={{border:borderSetting}} id="video" width="530" height="400" autoPlay muted></video>
                </div>
            )}

            <div style={{height:"30px"}}></div>

            <footer className={styles.footer}>
                {/* <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a> */}
            </footer>

            {currentView == 1 && (
                <>
                {visible && (
                    <>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <h2 style={{padding:"0", margin:"0", marginTop:"10px", color:theme}}>
                                {visible}
                            </h2>
                        </div>
                    </>
                )}
                 <br/>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <button 
                            onClick={handlePageRefresh}
                            style={{width:"30%", height:"50px", padding:"0px 15px", borderRadius:"13px", cursor:"pointer", textShadow:"1px 1px gray", fontWeight:"500", color:"gray", border:"2px solid gray"}}
                        >
                            Try Another Emotion
                        </button>
                    </div>
                    <br/>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <button 
                            type='button'
                            onClick={handleAffirmation}
                            style={{width:"15%", height:"50px", padding:"0px 10px", borderRadius:"13px", cursor:"pointer", textShadow:"1px 1px gray", fontWeight:"500", color:"gray", border:"2px solid gray"}}
                        >
                            Affirm
                        </button>
                    </div>
                </>
            )}
            <br/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <p style={{all:"unset", marginRight:"7px"}}>🔆</p>{selectEmotion}<p style={{all:"unset", marginLeft:"7px"}}>🌑</p>
            </div>

        </>
    )
}
export default Index;
