// import React, { useState, useEffect } from 'react';

// const Comments = ({ videoId }) => {
// //   const [comments, setComments] = useState([]);

// //   useEffect(() => {
// //     const fetchComments = async () => {
// //       const apiKey = "AIzaSyCkivBe46AdhpuiVneurxvRQHYeGqWH8gY";
// //       const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

// //       try {
// //         const response = await fetch(url);
// //         const data = await response.json();
// //         console.log(data)
// //         setComments(data.items || []);
// //       } catch (error) {
// //         console.error("Error fetching comments:", error);
// //       }
// //     };
// //     fetchComments();
// //   }, [videoId]);

// const [commentData, setCommentData] = useState([]);
// const [totalComments, setTotalComments] = useState(0);
// const apiKey = "AIzaSyCkivBe46AdhpuiVneurxvRQHYeGqWH8gY"; // Replace with your YouTube API key

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Fetch video details to get total comment count
//       const videoStatistics = await fetchVideoDetails(videoId, apiKey);
//       setTotalComments(videoStatistics.commentCount);

//       // Fetch comments
//       const comments = await fetchComments(videoId, apiKey);
//       setCommentData(comments);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData();
//   console.log(commentData, ">>>>")
// }, [videoId]);

// const fetchVideoDetails = async (videoId, apiKey) => {
//   const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data.items[0].statistics; // Returns statistics including comment count
// };

// const fetchComments = async (videoId, apiKey) => {
//   const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data.items; // Returns an array of comment items
// };

//   return (
//     <div>
//       <h2>Comments for Video ID: {videoId}</h2>
//       <p>Total Comments: {totalComments}</p>
//       <ul>
//         {commentData.map((comment) => (
//           <li key={comment.id}>
//             <strong>{comment.snippet.topLevelComment.snippet.authorDisplayName}:</strong>
//             <p>{comment.snippet.topLevelComment.snippet.textOriginal}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Comments;




'use client'

import React, { useEffect, useState } from 'react'
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

export default function Component() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [videoDetails, setVideoDetails] = useState({})
  const [allComments, setAllComments] = useState([])
  const [displayedComments, setDisplayedComments] = useState([])
  const [perPageComments, setPerPageComments] = useState(20)
  const [expandedMessages, setExpandedMessages] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  function getVideoId(url) {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    } else if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }
    return null
  }

  const handleSearch = () => {
    setVideoId(getVideoId(videoUrl))
  }

  useEffect(() => {
    const fetchDetails = async () => {
      const apiKey = "AIzaSyCkivBe46AdhpuiVneurxvRQHYeGqWH8gY"
      const VideoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
      const CommentDetailsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100`

      try {
        const responseVideoDetails = await fetch(VideoDetailsUrl)
        const dataVideoDetails = await responseVideoDetails.json()
        const responseCommentDetails = await fetch(CommentDetailsUrl)
        const dataCommentDetails = await responseCommentDetails.json() 
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
        setAllComments(dataCommentDetails?.items || [])
        setDisplayedComments(dataCommentDetails?.items?.slice(0, perPageComments) || [])
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }
    if (videoId) {
      fetchDetails()
    }
  }, [videoId])

  useEffect(() => {
    const filteredComments = allComments.filter(comment =>
      comment.snippet.topLevelComment.snippet.textDisplay.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setDisplayedComments(filteredComments.slice(0, perPageComments))
  }, [searchQuery, perPageComments, allComments])

  const handleLoadMore = () => {
    setPerPageComments(prevCount => prevCount + 20)
  }

  const createMarkup = (html) => {
    return { __html: html }
  }

  const hasVideoDetails = videoDetails && 
    Object.keys(videoDetails).length > 0 && 
    videoDetails.title !== 'No Title Found' &&
    videoDetails.description !== 'No Description Found'

  return (
    <div className='w-full py-20'>
      <div>
        <div className='mb-20'>
          <h1 className='text-6xl font-bold'>YouTube Comment Finder</h1>
          <p>Discover, analyze, and manage YouTube comments efficiently</p>
        </div>

        <div className="flex gap-2">
          <Input 
            placeholder="Enter YouTube Video URL" 
            className="mb-4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Button onClick={handleSearch} className="-gap-2">
            <Search className="mr-2 h-4 w-4" />
            <span className='hidden md:block'>Search</span>
          </Button>
        </div>

        {hasVideoDetails && (
          <div className='w-full p-6 flex gap-6 border'>
            <div className='w-2/5'>
              <img src={videoDetails.thumbnail} alt="thumbnail" className="w-full" />
            </div>
            <div className='w-3/5 space-y-5 text-left'>
              <p className='text-2xl font-bold'>{videoDetails.title}</p>
              <div 
                className={`text-gray-600 dark:text-gray-400 text-sm ${!expandedMessages['description'] ? 'line-clamp-4' : ''}`}
                dangerouslySetInnerHTML={createMarkup(videoDetails.description)}
              />
              {videoDetails.description?.length > 280 && (
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
              <div className='flex gap-2 flex-wrap'>  
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <IoMdPerson className='w-4 h-4'/>
                  {videoDetails.channelName}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <IoMdEye className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails.viewCount)}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <BiSolidLike className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails.likeCount)}
                </p>
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <BiSolidCommentDetail className='w-4 h-4'/>
                  {new Intl.NumberFormat().format(videoDetails.commentCount)}
                </p>  
                <p className='text-sm border px-2 py-1 rounded-sm flex gap-2 items-center'>
                  <MdDateRange className='w-4 h-4'/>
                  {format(new Date(videoDetails.publishedAt || new Date()), "LLL dd, y - hh:mm aa")}
                </p>
              </div>
            </div>
          </div>
        )}

        {displayedComments.length > 0 && (
          <div className='w-full flex flex-col gap-4 my-10'>
            <div>
              <h1 className='text-2xl font-semibold text-left'>Add Your Filters</h1>
            </div> 
            <div className="flex gap-2 items-end">
              <div className='space-y-1 text-left w-full'>
                <p className='text-xs font-semibold'>Keyword Search</p>
                <Input 
                  placeholder="Search comments" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className='space-y-1 text-left'>
                <p className='text-xs font-semibold'>Comments per page</p>
                <Select 
                  defaultValue={perPageComments.toString()} 
                  onValueChange={(value) => setPerPageComments(Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Comments per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='mt-10 h-[600px] overflow-y-auto scrollbar-hide text-left p-4'>
              {displayedComments.map((comment, index) => (
                <div key={index} className='hover:bg-gray-100 hover:border-b hover:border-black flex gap-4 px-2 py-4 mb-4 items-center'>
                  <div className=''>
                    <img src={comment?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} alt="profile" className='w-12 h-12 rounded-full'/>
                  </div>
                  <div className='w-full'>
                    <div className='w-full'>  
                      <div className='text-sm font-semibold flex justify-between'>
                        <a href={`https://www.youtube.com/channel/${comment?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`} target='_blank' rel="noopener noreferrer" className='hover:underline'>
                          {comment?.snippet?.topLevelComment?.snippet?.authorDisplayName}
                        </a>
                        <p className='text-xs text-gray-500'>
                          {format(new Date(comment?.snippet?.topLevelComment?.snippet?.publishedAt), "LLL dd, y - hh:mm aa")}
                        </p>
                      </div>
                    </div>
                    <div className='text-sm text-left'>
                      <p dangerouslySetInnerHTML={createMarkup(comment?.snippet?.topLevelComment?.snippet?.textDisplay)} />
                    </div>
                  </div>
                </div>
              ))}
              {displayedComments.length < allComments.length && (
                <Button variant="outline" className='w-full' onClick={handleLoadMore}>Load More</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
