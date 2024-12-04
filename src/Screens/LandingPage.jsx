'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search, Youtube, Download, Filter, Shuffle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from "date-fns"
import { MdDateRange } from "react-icons/md"
import { IoMdPerson } from "react-icons/io"
import { IoMdEye } from "react-icons/io"
import { BiSolidLike } from "react-icons/bi"
import { BiSolidCommentDetail } from "react-icons/bi"
import { IoClose } from "react-icons/io5";
import Information from './Information'

export default function LandingPage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [videoDetails, setVideoDetails] = useState({})
  const [allComments, setAllComments] = useState([])
  const [displayedComments, setDisplayedComments] = useState([])
  const [perPageComments, setPerPageComments] = useState(20)
  const [expandedMessages, setExpandedMessages] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [randomComment, setRandomComment] = useState(null)
  const [nextPageToken, setNextPageToken] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  function getVideoId(url){
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1)
      } 
      else if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v')
      }
    } catch (error) {
      console.error("Invalid URL:", error)
    }
    return null
  }

  const handleSearch = () => {
    const newVideoId = getVideoId(videoUrl)
    if (newVideoId) {
      setVideoId(newVideoId)
      setCurrentPage(1)
      setNextPageToken("")
      setAllComments([])
      setDisplayedComments([])
      setRandomComment(null)
    } else {
      alert("Please enter a valid YouTube URL")
    }
  }

  const fetchComments = async () => {
    setIsLoading(true)
    const apiKey = "AIzaSyDKtHyTfo-l9UO_ZHJh2Xz0jPhFpS5PV2o" // Replace with your actual API key
    const CommentDetailsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=${perPageComments}&pageToken=${nextPageToken}`

    try {
      const responseCommentDetails = await fetch(CommentDetailsUrl)
      const dataCommentDetails = await responseCommentDetails.json()
      const newComments = dataCommentDetails?.items || []
      setAllComments(prevComments => [...prevComments, ...newComments])
      setDisplayedComments(prevDisplayed => {
        const filteredNewComments = newComments.filter(comment =>
          comment.snippet.topLevelComment.snippet.textDisplay.toLowerCase().includes(searchQuery.toLowerCase())
        )
        return [...prevDisplayed, ...filteredNewComments].slice(0, perPageComments * currentPage)
      })
      setNextPageToken(dataCommentDetails?.nextPageToken || null)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      const apiKey = "AIzaSyCkivBe46AdhpuiVneurxvRQHYeGqWH8gY"
      const VideoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`

      try {
        const responseVideoDetails = await fetch(VideoDetailsUrl)
        const dataVideoDetails = await responseVideoDetails.json()
        setVideoDetails({
          thumbnail: dataVideoDetails?.items[0]?.snippet?.thumbnails?.standard?.url || dataVideoDetails?.items[0]?.snippet?.thumbnails?.default?.url,
          viewCount: dataVideoDetails?.items[0]?.statistics?.viewCount || 0,
          likeCount: dataVideoDetails?.items[0]?.statistics?.likeCount || 0,
          commentCount: dataVideoDetails?.items[0]?.statistics?.commentCount || 0,
          channelName: dataVideoDetails?.items[0]?.snippet?.channelTitle || '',
          title: dataVideoDetails?.items[0]?.snippet?.title || 'No Title Found',
          description: dataVideoDetails?.items[0]?.snippet?.description || 'No Description Found',
          publishedAt: dataVideoDetails?.items[0]?.snippet?.publishedAt || '',
        })
        await fetchComments()
      } catch (error) {
        console.error("Error fetching video details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    if (videoId) {
      fetchDetails()
    }
  }, [videoId])

  const handleRandomComment = () => {
    setOpen(true)
    if (allComments.length > 0) {
      const randomIndex = Math.floor(Math.random() * allComments.length)
      setRandomComment(allComments[randomIndex])
    } else {
      alert("No comments available to select from.")
    }
  }

  const debounce = (func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const debouncedFilter = useCallback(
    debounce((query) => {
      const filteredComments = allComments.filter(comment =>
        comment.snippet.topLevelComment.snippet.textDisplay.toLowerCase().includes(query.toLowerCase())
      )
      setDisplayedComments(filteredComments.slice(0, perPageComments * currentPage))
      if (filteredComments.length < perPageComments * currentPage && nextPageToken) {
        fetchComments()
      }
    }, 300), // 300ms delay
    [allComments, perPageComments, currentPage, nextPageToken, fetchComments]
  )

  useEffect(() => {
    debouncedFilter(searchQuery)
  }, [searchQuery, debouncedFilter])

  const handleLoadMore = async () => {
    if (nextPageToken) {
      setCurrentPage(prevPage => prevPage + 1)
      await fetchComments()
    }
  }

  const createMarkup = (html) => {
    return { __html: html }
  }

  const hasVideoDetails = videoDetails && Object.keys(videoDetails).length > 0 && videoDetails.title !== 'No Title Found' && videoDetails.description !== 'No Description Found'

  return (
    <div className='w-full max-w-6xl mx-auto py-20 px-4'>
      <div className='mb-20 text-center'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>YouTube Comment Finder</h1>
        <p className='text-xl text-gray-600 dark:text-gray-300'>Discover, analyze, and manage YouTube comments efficiently</p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mb-8">
        <Input 
          placeholder="Enter YouTube Video URL" 
          className="flex-grow"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <Button onClick={handleSearch} className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          <span>Search</span>
        </Button>
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {hasVideoDetails && !isLoading && (
        <Card className='w-full mb-8'>
          <CardContent className='p-4 md:p-6 flex flex-col md:flex-row gap-6'>
            <div className='w-full md:w-2/5'>
              <img src={videoDetails?.thumbnail} alt="Video thumbnail" className="w-full rounded-lg" />
            </div>
            <div className='w-full md:w-3/5 space-y-5 text-left'>
              <h2 className='text-2xl font-bold'>{videoDetails?.title}</h2>
              <div 
                className={`text-gray-600 dark:text-gray-400 text-sm ${!expandedMessages['description'] ? 'line-clamp-4' : ''}`}
                dangerouslySetInnerHTML={createMarkup(videoDetails?.description)}
              />
              {videoDetails?.description?.length > 280 && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setExpandedMessages(prev => ({
                      ...prev,
                      description: !prev.description
                    }))}
                    className="text-gray-400 hover:underline text-xs mt-2"
                  >
                    {expandedMessages['description'] ? 'Show less' : 'Read more'}
                  </button>
                </div>
              )}
              <div className='flex flex-wrap gap-2'>  
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <IoMdPerson className='w-4 h-4'/>
                  {videoDetails?.channelName}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <IoMdEye className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails?.viewCount)}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <BiSolidLike className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails?.likeCount)}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <BiSolidCommentDetail className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails?.commentCount)}
                </p>  
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <MdDateRange className='w-4 h-4'/>
                  {format(new Date(videoDetails?.publishedAt), "LLL dd, y - hh:mm aa")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {displayedComments.length > 0 && (
        <div className='w-full mb-8'>
          <h2 className='text-2xl font-semibold text-left mb-4'>Add Your Filters</h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
            <div className='space-y-1 text-left w-full lg:w-1/3'>
              <label htmlFor="keyword-search" className='text-xs font-semibold'>Keyword Search</label>
              <Input 
                id="keyword-search"
                placeholder="Search comments" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='space-y-1 text-left w-full md:w-1/2 lg:w-1/4'>
              <label htmlFor="comments-per-page" className='text-xs font-semibold'>Comments per page</label>
              <Select 
                defaultValue={perPageComments.toString()} 
                onValueChange={(value) => setPerPageComments(Number(value))}
              >
                <SelectTrigger id="comments-per-page">
                  <SelectValue placeholder="Comments per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleRandomComment} className='w-44 md:w-auto'>
              <Shuffle className="mr-0 md:mr-2 h-4 w-0 md:w-4" />
              Random Comment
            </Button>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className='w-44 md:w-auto '>
                  <Download className="h-4 w-0 md:w-4 mr-0 md:mr-2" />
                  Export Comments
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Save as Excel</DropdownMenuItem>
                <DropdownMenuItem>Save as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

    {(open && randomComment) && (
         <div className="mt-8 border border-black text-left rounded-lg p-2 md:p-4 relative">
         <div className="absolute -top-2 -right-1 bg-black rounded-full p-1 cursor-pointer">
           <IoClose className="w-4 h-4 text-white" onClick={() => setOpen(false) }/>
         </div>
         <h1 className='text-2xl font-bold'>Random Comment</h1>
         <div className='flex gap-4 px-2 py-4 mb-4 items-start'>
           <img src={randomComment.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="User avatar" className='w-12 h-12 rounded-full'/>
           <div className='flex-1'>
             <div className='text-sm font-semibold flex flex-col md:flex-row justify-between mb-2'>
               <a href={`https://www.youtube.com/channel/${randomComment?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`} target='_blank' rel="noopener noreferrer" className='hover:underline'>
                 {randomComment?.snippet?.topLevelComment?.snippet?.authorDisplayName}
               </a>
               <p className='text-xs text-gray-500'>
                 {format(new Date(randomComment?.snippet?.topLevelComment?.snippet?.publishedAt), "LLL dd, y - hh:mm aa")}
               </p>
             </div>
             <div className='text-sm'>
               <p dangerouslySetInnerHTML={createMarkup(randomComment?.snippet?.topLevelComment?.snippet?.textDisplay)} />
             </div>
           </div>
         </div>
       </div>
      )}

      {displayedComments.length > 0 && (
        <div className='mt-10 h-[600px] overflow-y-auto scrollbar-hide text-left p-2 md:p-4 rounded-lg'>
          {displayedComments.map((comment, index) => (
            <div key={index} className='hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-b hover:border-black flex gap-4 px-2 py-4 mb-4 items-start'>
              <img src={comment?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} alt="User avatar" className='w-8 h-8 md:w-12 md:h-12 rounded-full'/>
              <div className='flex-1'>
                <div className='text-sm font-semibold flex flex-col md:flex-row justify-between mb-2'>
                  <a href={`https://www.youtube.com/channel/${comment?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`} target='_blank' rel="noopener noreferrer" className='hover:underline'>
                    {comment?.snippet?.topLevelComment?.snippet?.authorDisplayName}
                  </a>
                  <p className='text-xs text-gray-500'>
                    {format(new Date(comment?.snippet?.topLevelComment?.snippet?.publishedAt), "LLL dd, y - hh:mm aa")}
                  </p>
                </div>
                <div className='text-sm'>
                  <p dangerouslySetInnerHTML={createMarkup(comment?.snippet?.topLevelComment?.snippet?.textDisplay)} />
                </div>
              </div>
            </div>
          ))}
          {displayedComments.length < parseInt(videoDetails.commentCount) && (
            <Button variant="outline" className='w-full' onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </div>
      )}

      <Information />
    </div>
  )
}