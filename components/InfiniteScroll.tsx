import React, { useState, useEffect } from 'react'

const InfiniteScroll = ({ children, chunkSize }) => {
  const [visibleData, setVisibleData] = useState([])
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    setVisibleData(React.Children.toArray(children).slice(0, chunkSize))
  }, [children, chunkSize])

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const threshold = 200 // Adjust this value as needed

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      const endIndex = startIndex + chunkSize
      const nextChunk = React.Children.toArray(children).slice(
        startIndex,
        endIndex
      )
      setVisibleData(prevData => [...prevData, ...nextChunk])
      setStartIndex(endIndex)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleData, startIndex])

  return (
    <div>
      {/* Render visible data */}
      {visibleData.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </div>
  )
}

export default InfiniteScroll
