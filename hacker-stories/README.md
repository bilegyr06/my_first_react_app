# Hacker Stories

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A simple, modern React application for searching and browsing Hacker News stories. Built as a learning project with the aid of the book "Road to React" to practice core React concepts: hooks (`useState`, `useEffect`, `useReducer`), custom hooks, asynchronous data fetching, local storage persistence, and component composition.

Live Demo: (Add your deployed link here, e.g., Vercel/Netlify URL if deployed)

## 📝 Description

Hacker Stories is a searchable frontend for the Hacker News API (powered by Algolia). Users can:

- Type a search query to instantly filter and fetch relevant stories
- View story details: title, URL, author, points, and number of comments
- Dismiss individual stories (state persists across refreshes via localStorage)
- Load more results with pagination

This project demonstrates clean, functional React patterns without external state management libraries.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation & Running Locally

```bash
git clone https://github.com/bilegyr06/my_first_react_app.git
cd my_first_react_app/hacker-stories
npm install
npm start