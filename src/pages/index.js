import * as React from "react"
import Home from './home'
import { AppProvider } from "../state/app-context"
import Layout from "./layout"

// markup
const IndexPage = () => {
  return (
    <AppProvider>
      <Layout>
        <Home />
      </Layout>
    </AppProvider>
  )
}

export default IndexPage
