import { Link } from 'react-router-dom'
import { UseSettings } from '../context/SettingsContext'
import PostFlag from './PostFlag'

function PostCard({ post }) {
  const { settings } = UseSettings()
  const timeAgo = FormatTimeAgo(post.created_at)

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-card-header">
        <p className="post-card-time">{timeAgo}</p>
        <PostFlag flag={post.flag} />
      </div>
      <h2 className="post-card-title">{post.title}</h2>
      {settings.showContentOnFeed && post.content && (
        <p className="post-card-content">{post.content}</p>
      )}
      {settings.showImageOnFeed && post.image_url && (
        <img src={post.image_url} alt="" className="post-card-image" />
      )}
      <p className="post-card-upvotes">⬆ {post.upvotes} upvotes</p>
      {post.repost_of && (
        <p className="post-card-repost">↪ Repost of #{post.repost_of}</p>
      )}
    </Link>
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

export default PostCard
