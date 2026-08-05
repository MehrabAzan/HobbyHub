import { GetVideoEmbedUrl } from '../lib/video'

function VideoEmbed({ url }) {
  const embedUrl = GetVideoEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <div className="video-embed">
      <iframe
        src={embedUrl}
        title="Post video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default VideoEmbed
