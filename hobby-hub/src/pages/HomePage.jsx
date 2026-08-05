import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PostCard from '../components/PostCard'

const FLAG_OPTIONS = ['all', 'Question', 'Opinion']

function HomePage() {
  const [posts, setPosts] = useState([])
  const [orderBy, setOrderBy] = useState('created_at')
  const [flagFilter, setFlagFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    FetchPosts()
  }, [orderBy, searchQuery, flagFilter])

  async function FetchPosts() {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*')
      .order(orderBy, { ascending: false })

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    if (flagFilter !== 'all') {
      query = query.eq('flag', flagFilter)
    }

    const { data, error } = await query
    if (!error) setPosts(data)
    setLoading(false)
  }

  return (
    <div className="home-page">
      <div className="sort-bar">
        <span>Order by:</span>
        <button
          className={`sort-btn ${orderBy === 'created_at' ? 'active' : ''}`}
          onClick={() => setOrderBy('created_at')}
        >
          Newest
        </button>
        <button
          className={`sort-btn ${orderBy === 'upvotes' ? 'active' : ''}`}
          onClick={() => setOrderBy('upvotes')}
        >
          Most Popular
        </button>
      </div>

      <div className="filter-bar">
        <span>Filter by flag:</span>
        {FLAG_OPTIONS.map((flag) => (
          <button
            key={flag}
            className={`sort-btn ${flagFilter === flag ? 'active' : ''}`}
            onClick={() => setFlagFilter(flag)}
          >
            {flag === 'all' ? 'All' : flag}
          </button>
        ))}
      </div>

      {searchQuery && (
        <p className="search-label">Showing results for: <strong>"{searchQuery}"</strong></p>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <p className="no-posts">No posts found. Be the first to post!</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
