import React, {useEffect, useState, useContext} from 'react'
import { Grid, Transition } from 'semantic-ui-react'
import {useQuery} from '@apollo/client'
// import gql from 'graphql'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import {FETCH_POST_QUERY} from '../util/graphql'

import {AuthContext} from '../context/auth'

function Home() {
    const {user} = useContext(AuthContext)
    const {loading, data} = useQuery(FETCH_POST_QUERY)
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if (data) {
          setPosts(data.getPosts);
        }
    },[data])

    return (
        <Grid columns={3}>  
        <Grid.Row className="page-title">
            <h1>Recent posts</h1>
        </Grid.Row>
        <Grid.Row>
            {user && (
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            )}
            {loading? (
                <h1>Loading posts...</h1>
            ) : (
               <Transition.Group>
                   {
                        posts && posts.map(post => (
                            <Grid.Column key={post.id} style={{marginBottom: 20}}>
                                <PostCard post={post}/>
                            </Grid.Column>
                        ))
                   }
               </Transition.Group>
            )}
        </Grid.Row>
        </Grid>
    )
}

export default Home