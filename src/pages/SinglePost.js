import React, {useContext, useState, useRef} from 'react'
import {gql, useMutation, useQuery} from '@apollo/client'
import moment from 'moment'

import {Button, Form, Icon, Label, Card, Grid, GridColumn, Image } from 'semantic-ui-react';
import LikeButton from '../components/LikeButton'
import {AuthContext} from '../context/auth'
import DeleteButton from '../components/DeleteButton';



function SinglePost(props){
    const postId = props.match.params.postId
    const {user} = useContext(AuthContext)
    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('')

    const {data: {getPost} = {}} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    let singlePost
    if(!getPost){
        singlePost = <p>Loading...</p>
    } else {
        const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost
        singlePost = (
            <Grid>
                <Grid.Row>
                    <GridColumn width={2}>
                        <Image 
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            floated="right"
                        />    
                    </GridColumn>
                    <GridColumn width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {username}
                                </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post = {{id, likeCount, likes}} />
                                <Button as="div" 
                                        labelPosition="right"
                                        onClick={()=> console.log('Comment on post')}>
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <p>Post a comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            placeholder="Comment.."
                                            name={comment}
                                            onChange={event => setComment(event.target.value )}
                                            ref={commentInputRef}
                                            />
                                            <button 
                                            type="submit" 
                                            className="ui button teal"
                                            disabled={comment.trim() === ''}
                                            onClick={submitComment}
                                            >Submit</button>
                                    </div>
                                </Form>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </GridColumn>
                </Grid.Row>
            </Grid>
        )
    }
    return singlePost
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id 
            body 
            createdAt 
            username 
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost