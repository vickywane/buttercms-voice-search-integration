import * as React from "react"
import AppContext from "../state/app-context"

const AudioRecorder = () => {
    const { startRecorder, recorderStatus, convertedAudioResult } = React.useContext(AppContext)

    return (
        <div className="align-center" >
            {recorderStatus === "GENERATING_VOICE_RESULT" ?
                <p> Generating Text From Your Voice Record ... </p>
                :
                recorderStatus === "PERFORM_TEXT_SEARCH" ?
                    <div>
                        <p> Searching for <b> {convertedAudioResult} </b> within ButterCMS FAQ... </p>
                        <br />
                        <div className="flex align-center" >
                            <p className="mr-2 text-gray-400 pointer:text-hover" > Wrong Text? </p>

                            <p onClick={() => startRecorder()} > Record Audio Again </p>
                        </div>
                    </div>
                    :
                    <button className="custom-btn" onClick={() => startRecorder()} > Try Audio Based Search </button>
            }
        </div>
    )
}

const Hero = () => {
    const [searchItem, setSearchItem] = React.useState('')
    const { performTextSearch, recorderStatus } = React.useContext(AppContext)

    return (
        <div className="hero-container" >
            <div>
                <div className="mb-5" >
                    <h1 className="text-2xl mb-5 text-center" >
                        Frequently Asked Questions
                    </h1>

                    <p className="text-center" >
                        Frequently asked questions about Butter and how to do various things with our headless approach to CMS.
                    </p>
                </div>

                {recorderStatus !== "GENERATING_VOICE_RESULT" &&
                    (
                        <form onSubmit={(e) => {
                            performTextSearch(searchItem)
                            e.preventDefault()
                        }} className="align-center" >
                            <input className="custom-input" placeholder="Search for a frequent question" value={searchItem} onChange={e => setSearchItem(e.target.value)} />

                            <button className="custom-btn" type="submit"> Submit  </button>
                        </form>
                    )}
                <br />

                <AudioRecorder />
            </div>
        </div>
    )
}

export default Hero
