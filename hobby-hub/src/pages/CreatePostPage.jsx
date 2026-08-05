import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GetUserId } from '../lib/userId'
import { UploadPostImage } from '../lib/storage'

function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [flag, setFlag] = useState('')
  const [repostOf, setRepostOf] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function HandleSubmit(e) {
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

    const payload = {
      title: title.trim(),
      content: content.trim() || null,
      image_url: finalImageUrl,
      video_url: videoUrl.trim() || null,
      flag: flag || null,
      repost_of: repostOf.trim() || null,
      author_id: GetUserId(),
      upvotes: 0,
    }

    const { data, error: err } = await supabase
      .from('posts')
      .insert(payload)
      .select()
      .single()

    if (err) {
      setError('Failed to create post. Please try again.')
      setSubmitting(false)
      return
    }

    navigate(`/post/${data.id}`)
  }

  return (
    <div className="form-page">
      <h1>Create a New Post</h1>
      <form className="post-form" onSubmit={HandleSubmit}>
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
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostPage
