# Live Book – Interactive AI Story Generator

Live Book is a modern, interactive web application that lets you create and experience unique, AI-generated stories. Choose your language and genre, then make decisions at every step to shape the narrative. Powered by Google Gemini, Live Book delivers immersive, branching stories with vivid scene descriptions and multiple choices.

---

## ✨ Features

- **AI-powered interactive stories**: Each story is generated in real-time by Google Gemini, adapting to your choices.
- **Multiple genres**: Sci-Fi, Fantasy, Horror, Romance, Mystery, and more.
- **Multi-language support**: Start your adventure in English or Polish.
- **Rich scene descriptions**: Each part of the story includes a detailed image description for visualization.
- **Modern UI/UX**: Responsive, dark mode support, and smooth transitions.
- **No account required**: Jump right in and start your adventure!

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** v7 or higher
- **Google Gemini API key**

### 1. Clone the repository
```bash
git clone https://github.com/patrasxd/live-book.git
cd live-book
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the `server` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Start the app (development)
In one terminal, run the Angular frontend:
```bash
npm start
```
In another terminal, run the backend server:
```bash
npm run server
```
Or, for both at once:
```bash
npm run dev
```

- Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 🏗️ Building for Production

1. Build the Angular app and install server dependencies:
```bash
npm run build:prod
```
2. Start the production server:
```bash
npm run start:prod
```
- The app will be available at `http://localhost:3000` (or your specified `PORT`).

### Using PM2 (Recommended for Production)
```bash
npm install -g pm2
pm run build:prod
pm run start:prod # or pm2 start server/server.js --name "live-book"
```

---

## 🛠️ Configuration

- `GEMINI_API_KEY` – Your Google Gemini API key (required)
- `PORT` – Port for the backend server (default: 3000)

---

## 🧑‍💻 Usage
1. **Choose your language and genre** on the welcome screen.
2. **Read the story** as it unfolds, with each part including a vivid image description.
3. **Select from three options** at each step to decide what happens next.
4. **Continue until the story ends** or take an unexpected turn!

---

## 🧩 Tech Stack
- **Frontend**: Angular 19, TailwindCSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Other**: RxJS, TypeScript, PM2 (optional for prod)

---

## 📂 Project Structure
- `src/` – Angular frontend
- `server/` – Node.js/Express backend
- `.env` – Environment variables (in `server/`)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License
[MIT](LICENSE) (or specify your license here)
