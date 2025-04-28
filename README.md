# Chat App Test Project

## How to run the project

```bash
npm install
npm start
```

## How autoscroll is implemented

To make the chat automatically scroll down when a new message appears, I used a simple approach with React hooks.

I created a ref (called bottomRef) and placed it on an empty <div> at the end of the messages list.
Then, inside a useEffect, I listen for changes to the messages array.
Every time a new message is added, I call scrollIntoView({ behavior: 'smooth' }) on that ref.

This way, the chat always smoothly scrolls to the latest message without the user needing to scroll manually.

## Why Redux was chosen

I decided to use Redux because I’m more familiar with it and feel more comfortable managing application state this way.
It also provides a simple and scalable structure even for relatively small projects.
