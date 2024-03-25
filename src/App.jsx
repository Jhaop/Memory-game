import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(true)
  const [clicked, setClicked] = useState([])
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const url = "https://api.giphy.com/v1/gifs/search?api_key=DWg7wxB4xKGmLns3lJkhUJJtTDh7BF6g&q=messi&limit=12&offset=0&rating=pg&lang=en&bundle=messaging_non_clips"

  useEffect(() => {
    const getImages = (
      fetch(url, { mode: 'cors' })
        .then((response) => response.json())
        .then((imagesObject => {
          setLoading(false)
          console.log(imagesObject.data)
          const newObject = imagesObject.data.map((image) => {
            if (isLoading) {
              console.log('isLoading: ' + isLoading)
              return image
              //return image.images.fixed_width.url
            }
          })
          setImages(images => [...images, ...newObject])
        }))
    )
    return () => {
      clearInterval(getImages)
    }
  }, [])

  useEffect(() => {
    if (score > maxScore) {
      setMaxScore(score)
    }
  }, [score])

  function randomize() {
    const SIZE = 12;
    let temp_order = []
    let rand = Math.floor(Math.random() * SIZE)
    const imagesRandomOrder = []
    temp_order.push(rand)
    while (temp_order.length < SIZE) {
      rand = Math.floor(Math.random() * SIZE)
      if (!temp_order.includes(rand)) {
        temp_order.push(rand)
      }
    }
    for (let i = 0; i < temp_order.length; i++) {
      imagesRandomOrder.push(images[temp_order[i]])
    }
    setImages(imagesRandomOrder)
  }

  function onImageClick(e) {
    const id = e.target.id
    if (clicked.includes(id)) {
      if (score > maxScore) {
        setMaxScore(score)
      }
      setScore(0)
      setClicked([])
      return;
    }
    setClicked(clicked => [...clicked, id])
    setScore(score + 1)
    randomize()
  }

  return (
    <>
      <div className="gameContainer">
        {isLoading &&
          <h1>Loading...</h1>
        }
        {!isLoading &&
          images.map(image =>
            <img key={image.id} id={image.id} src={image.images.fixed_width.url} onClick={onImageClick}></img>
          )
        }
        {!isLoading &&
          <>
            <h2>Current Score: {score}</h2>
            <h2>Max Score: {maxScore}</h2>
          </>
        }

      </div>
    </>
  )
}

export default App