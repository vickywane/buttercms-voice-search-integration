import * as React from "react"
import AppContext from "../state/app-context"
import Hero from '../components/hero'
import Navbar from '../components/navbar'
import "../home.css"
import Posts from "../components/posts"

// styles
const pageStyles = {
    color: "#232129",
    // padding: 96,
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

// markup
const IndexPage = () => {
    const [searchItem, setSearchItem] = React.useState('')
    const { startRecorder, recorderStatus, stopRecorder } = React.useContext(AppContext)

    return (
        <div>
            <Navbar />

            <main style={pageStyles}>
                <Hero />

                <Posts />
            </main>
        </div>
    )
}

export default IndexPage
