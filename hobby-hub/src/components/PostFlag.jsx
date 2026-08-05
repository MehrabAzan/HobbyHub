function PostFlag({ flag }) {
  if (!flag) return null

  const className = flag === 'Question' ? 'post-flag question' : 'post-flag opinion'

  return <span className={className}>{flag}</span>
}

export default PostFlag
