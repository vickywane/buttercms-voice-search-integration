import * as React from "react"
import Hero from '../components/hero'
import Navbar from '../components/navbar'
import "../home.css"
import Posts from "../components/posts"

// markup
const IndexPage = () => {
    return (
        <div>
            <Navbar />

            <Hero />

            <Posts />
        </div>
    )
}

export default IndexPage
