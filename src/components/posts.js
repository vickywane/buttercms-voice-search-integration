import React from "react";
import { sampleData } from '../sampleData'
import AppContext from "../state/app-context";

const cardStyle = {
    boxShadow: '0 3px 5px grey',
    margin: '1rem 0',
    padding: '2rem 1rem',
    width: '95%',
    borderRadius: '5px'
}

const Posts = () => {
    const { fetchBlogPosts, blogPosts } = React.useContext(AppContext)

    React.useEffect(() => {
        fetchBlogPosts()
    }, [])

    return (
        <div>
            <ul className="align-center" style={{ flexDirection: 'column' }}  >

                {
                    blogPosts ? blogPosts.length > 0 ?
                        <div>
                            {blogPosts.map((post, index) => (
                                <li key={index} style={cardStyle} >
                                    <h2 className="text-2xl mb-3" > {post.title} </h2>

                                    <p> {post.summary} </p>
                                </li>
                            ))}
                        </div>
                        :
                        <div className="my-10" >
                            <p className="text-center" > No ButterCMS FAQ item found. <br /> If you performed a search, consider searching for other FAQ </p>
                        </div>
                        :
                        <div className="my-10" >
                            <p> Fetching ButterCMS FAQ items ... </p>
                        </div>
                }

            </ul>
        </div>
    )
}

export default Posts