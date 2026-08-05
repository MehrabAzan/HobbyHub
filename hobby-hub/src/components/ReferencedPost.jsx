import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ReferencedPost({ postId }) {
  const [referencedPost, setReferencedPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function FetchReferencedPost() {
      const { data } = await supabase
        .from('posts')
        .select('id, title, upvotes, created_at')
        .eq('id', postId)
        .single()

      setReferencedPost(data || null)
      setLoading(false)
    }

    if (postId) FetchReferencedPost()
  }, [postId])

  if (loading) {
    return <p className="referenced-post-loading">Loading referenced post...</p>
  }

  if (!referencedPost) {
    return <p className="referenced-post-missing">Referenced post #{postId} not found.</p>
  }

  return (
    <Link to={`/post/${referencedPost.id}`} className="referenced-post">
      <span className="referenced-post-label">Repost of</span>
      <h3>{referencedPost.title}</h3>
      <p>⬆ {referencedPost.upvotes} upvotes</p>
    </Link>
  )
}

export default ReferencedPost
