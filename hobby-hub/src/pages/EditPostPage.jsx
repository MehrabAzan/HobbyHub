import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GetUserId } from '../lib/userId'
import { UploadPostImage } from '../lib/storage'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [flag, setFlag] = useState('')
  const [repostOf, setRepostOf] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [authorId, setAuthorId] = useState(null)
  const currentUserId = GetUserId()

  useEffect(() => {
    FetchPost()
  }, [id])

  async function FetchPost() {
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (err || !data) {
      navigate('/')
      return
    }

    if (data.author_id && data.author_id !== currentUserId) {
      navigate(`/post/${id}`)
      return
    }

    setTitle(data.title)
    setAuthorId(data.author_id || null)
    setContent(data.content || '')
    setImageUrl(data.image_url || '')
    setVideoUrl(data.video_url || '')
    setFlag(data.flag || '')
    setRepostOf(data.repost_of ? String(data.repost_of) : '')
    setLoading(false)
  }

  async function HandleUpdate(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)

    let finalImageUrl = imageUrl.trim() || null

    if (imageFile) {
      try {
        finalImageUrl = await UploadPostImage(imageFile)
      } catch {
        setError('Failed to upload image. Please try again or use an image URL.')
        setSubmitting(false)
        return
      }
    }

    let updateQuery = supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim() || null,
        image_url: finalImageUrl,
        video_url: videoUrl.trim() || null,
        flag: flag || null,
        repost_of: repostOf.trim() || null,
      })
      .eq('id', id)

    if (authorId) {
      updateQuery = updateQuery.eq('author_id', currentUserId)
    }

    const { error: err } = await updateQuery

    if (err) {
      setError('Failed to update post. Please try again.')
      setSubmitting(false)
      return
    }

    navigate(`/post/${id}`)
  }

  async function HandleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return

    await supabase.from('comments').delete().eq('post_id', id)

    let deleteQuery = supabase.from('posts').delete().eq('id', id)
    if (authorId) {
      deleteQuery = deleteQuery.eq('author_id', currentUserId)
    }
    await deleteQuery

    navigate('/')
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  return (
    <div className="form-page">
      <h1>Edit Post</h1>
      <form className="post-form" onSubmit={HandleUpdate}>
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content (Optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <input
          type="url"
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={!!imageFile}
        />
        <label className="file-input-label">
          <span>Upload image from device (Optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>
        {imageFile && <p className="file-name">Selected: {imageFile.name}</p>}
        <input
          type="url"
          placeholder="Video URL — YouTube or Vimeo (Optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <select value={flag} onChange={(e) => setFlag(e.target.value)}>
          <option value="">No flag</option>
          <option value="Question">Question</option>
          <option value="Opinion">Opinion</option>
        </select>
        <input
          type="text"
          placeholder="Repost of post ID (Optional)"
          value={repostOf}
          onChange={(e) => setRepostOf(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
          <button type="button" className="btn-danger" onClick={HandleDelete}>
            Delete Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPostPage
