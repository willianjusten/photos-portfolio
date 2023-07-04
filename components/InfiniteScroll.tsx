import React, { useState, useEffect } from 'react'

const InfiniteScroll = ({ children, chunkSize }) => {
  const [visibleData, setVisibleData] = useState([])
  const [lastLoadedIndex, setLastLoadedIndex] = useState(0)

  useEffect(() => {
    setVisibleData(React.Children.toArray(children).slice(0, chunkSize))
  }, [children, chunkSize])

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const threshold = 200 // Adjust this value as needed

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      const startIndex = lastLoadedIndex
      const endIndex = lastLoadedIndex + chunkSize
      const nextChunk = React.Children.toArray(children).slice(
        startIndex,
        endIndex
      )
      setVisibleData(prevData => [...prevData, ...nextChunk])
      setLastLoadedIndex(endIndex)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleData, lastLoadedIndex])

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
