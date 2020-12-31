import React, {useContext} from 'react'
import {Card, Image, Button, Label, Icon, Popup} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import {AuthContext} from '../context/auth'

function PostCard({post: {body, createdAt, id, username, likeCount, commentCount, likes}}) {
    const { user } = useContext(AuthContext)


    return (
        <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
          <Card.Description>
            {body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <LikeButton user={user} post={{id, likes, likeCount}}/>
            <Popup
              content="Comment on post"
              inverted
              trigger={
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='blue'>
                    <Icon name='comments' />
                    Comments
                </Button>
                <Label as='a' basic color='blue' pointing='left'>
                    {commentCount}
                </Label>
                </Button>
              }
            >
            </Popup>

            {user && user.username === username && (
              <DeleteButton postId={id} />
            )}
        </Card.Content>
      </Card>
    )
}
export default PostCard