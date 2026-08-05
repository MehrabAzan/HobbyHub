import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GetUserId, FormatUserId } from '../lib/userId'
import PostFlag from '../components/PostFlag'
import VideoEmbed from '../components/VideoEmbed'
import ReferencedPost from '../components/ReferencedPost'

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentBody, setCommentBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const currentUserId = GetUserId()

  useEffect(() => {
    FetchPost()
    FetchComments()
  }, [id])

  async function FetchPost() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      navigate('/')
      return
    }
    setPost(data)
    setLoading(false)
  }

  async function FetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (data) setComments(data)
  }

  async function HandleUpvote() {
    const { data } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single()

    if (data) setPost(data)
  }

  async function HandleAddComment(e) {
    e.preventDefault()
    if (!commentBody.trim()) return
    setSubmittingComment(true)

    const { data } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        body: commentBody.trim(),
        author_id: currentUserId,
      })
      .select()
      .single()

    if (data) {
      setComments((prev) => [...prev, data])
      setCommentBody('')
    }
    setSubmittingComment(false)
  }

  async function HandleDeleteComment(commentId) {
    const comment = comments.find((c) => c.id === commentId)
    if (!comment || comment.author_id !== currentUserId) return

    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  const timeAgo = FormatTimeAgo(post.created_at)
  const isAuthor = !post.author_id || post.author_id === currentUserId

  return (
    <div className="post-page">
      <div className="post-meta">
        <p className="post-time">{timeAgo}</p>
        {post.author_id && (
          <p className="post-author">Author: {FormatUserId(post.author_id)}</p>
        )}
        <PostFlag flag={post.flag} />
      </div>
      <h1 className="post-title">{post.title}</h1>

      {post.repost_of && <ReferencedPost postId={post.repost_of} />}

      {post.content && <p className="post-content">{post.content}</p>}
      {post.image_url && (
        <img src={post.image_url} alt="Post image" className="post-image" />
      )}
      {post.video_url && <VideoEmbed url={post.video_url} />}

      <div className="post-actions">
        <button className="upvote-btn" onClick={HandleUpvote}>
          ⬆ {post.upvotes} upvotes
        </button>
        {isAuthor && (
          <Link to={`/post/${id}/edit`} className="edit-btn">✏ Edit</Link>
        )}
      </div>

      <section className="comments-section">
        <h2>Comments</h2>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Start the discussion!</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c.id} className="comment-item">
                <div className="comment-body">
                  <span>– {c.body}</span>
                  {c.author_id && (
                    <span className="comment-author">{FormatUserId(c.author_id)}</span>
                  )}
                </div>
                {c.author_id === currentUserId && (
                  <button
                    type="button"
                    className="comment-delete"
                    onClick={() => HandleDeleteComment(c.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <form className="comment-form" onSubmit={HandleAddComment}>
          <input
            type="text"
            placeholder="Leave a comment..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={submittingComment}>
            {submittingComment ? 'Posting...' : 'Post'}
          </button>
        </form>
      </section>
    </div>
  )
}

function FormatTimeAgo(timestamp) {
  const now = new Date()
  const created = new Date(timestamp)
  const diffMs = now - created
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffMins < 60) return `Posted ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `Posted ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `Posted ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  return `Posted ${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
}

export default PostPage
