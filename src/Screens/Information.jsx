import React from 'react'
import demoImg from '../assets/demoImg.png'

const keyFeatures = [
  {
    title: "Comment Search",
    description: "Enter keywords to search for specific comments within a YouTube video, allowing for targeted feedback retrieval and deeper insights into audience sentiment."
  },
  {
    title: "Random Comment Picker",
    description: "Select random comments from a video, ideal for giveaways, contests, or gathering a wide range of audience perspectives."
  },
  {
    title: "Comment Sorting",
    description: "Organize comments by date, likes, or reply count, giving you full control over how comments are displayed and accessed."
  }
]

export default function Information() {
  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Information</h1>  
      <p className="mb-4 text-sm md:text-base">
        The comment section of a YouTube video is one of the most engaging spaces for viewers to
        share opinions, feedback, and reactions. However, navigating this extensive feedback can
        be challenging, especially when searching for specific comments or insights within a sea
        of responses.
      </p>
      <p className="mb-4 text-sm md:text-base">
        The "YouTube Comment Finder" application is designed to address this challenge, offering
        a powerful solution to explore YouTube comments more effectively. This tool enables users
        to quickly search, filter, and sort comments, making it easy to find relevant discussions
        and analyze viewer feedback with precision, transforms the YouTube comment experience by making it
        accessible, manageable, and insightful, whether for casual browsing or comprehensive
        analysis.
      </p>
    <div className='w-4/6 mx-auto bg-black p-1 my-10 rounded-lg'>
    <img src={demoImg} alt='demo' className='w-full rounded-md' />
    </div>

      
      <h2 className="text-xl font-semibold mb-3">Key Features:</h2>
      <ul className="list-disc text-sm md:text-base pl-5 mb-4 space-y-2">
        {keyFeatures.map((feature, index) => (
          <li key={index}>
            <span className='font-semibold'>{feature.title}:</span> {feature.description}
          </li>
        ))}
      </ul>
    </div>
  )
}