# 💌 Birthday Love Letter – Cloudflare Worker

<p align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

# Quick Demo

Check the page at https://corecoderx.github.io/love-proposal-birthday-wish/

# Interactive Birthday Letter

An interactive birthday website that gradually unfolds into a personal story.

Rather than displaying a simple greeting, the experience is divided into multiple sections including a birthday celebration, memory gallery, handwritten letter, interactive conversation, and a final confession. Every stage is designed to feel like a handwritten gift instead of a traditional webpage.

The project is fully client-side and can be deployed easily using Cloudflare Workers.

---

## Preview

Features included:

- Interactive birthday cake with candle animation
- Confetti celebration
- Floating decorations
- Memory carousel
- Handwritten birthday letter
- Multi-step dialogue system
- Timeline of memories
- Typewriter animations
- Scroll-triggered transitions
- Responsive layout
- Progress saved using LocalStorage
- Sound effects generated using the Web Audio API

---

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- GSAP
- ScrollTrigger
- Tailwind CSS
- Iconify
- Cloudflare Workers

---

# Project Structure

```
.
├── worker.js
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

---

# Deployment

## 1. Create a Cloudflare Worker

1. Sign in to your **Cloudflare Dashboard**.
2. Click the **Search** bar at the top of the page.
3. Search for **Workers & Pages** and open it.
4. Click **Create**.
5. Select **Create Application**.
6. Choose **Create Worker**.
7. Select the **Hello World** template.
8. Enter a name for your Worker.
9. Click **Deploy**.

Cloudflare will create a default Hello World Worker.

---

## 2. Replace the Worker Code

1. Open the Worker you just created.
2. Click **Edit Code**.
3. Delete all the existing code.
4. Copy the `worker.js` file from this repository.
5. Paste it into the Cloudflare editor.
6. Click **Deploy** to save the changes.

---

## 3. Create Environment Variables

This project uses Cloudflare Worker Environment Variables to securely store your Telegram credentials.

1. Open your Worker.
2. Go to **Settings**.
3. Select **Variables and Secrets**.
4. Click **Add**.
5. Create the following variables:

| Variable | Description |
|-----------|-------------|
| `BOT_TOKEN` | Your Telegram Bot Token |
| `CHAT_ID` | Your Telegram Chat ID |

6. Save both variables.
7. Click **Deploy** again to apply the changes.

> **Note**
>
> Do not hardcode your Telegram Bot Token or Chat ID inside `worker.js`. Keeping them as Environment Variables is the recommended and secure approach.

---

## 4. Get Your Telegram Credentials

### Telegram Bot Token

1. Open Telegram.
2. Search for **@BotFather**.
3. Send the following command:

```
/newbot
```

4. Follow the instructions to create your bot.
5. Copy the generated Bot Token.
6. Paste it into the `BOT_TOKEN` Environment Variable.

---

### Telegram Chat ID

1. Send any message to your newly created bot.
2. Open the following URL in your browser (replace `<BOT_TOKEN>` with your actual bot token):

```
https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
```

3. Find the following section in the response:

```json
"chat": {
    "id": 123456789
}
```

4. Copy the numeric value of `id`.
5. Paste it into the `CHAT_ID` Environment Variable.

---

## 5. Configure the Project

Open `worker.js` and replace the placeholder values with your own content.

See the **Configuration Guide** below for all editable sections.

---

## 6. Access Your Website

After deploying your Worker, Cloudflare will generate a URL similar to:

```text
https://your-project.workers.dev
```

Copy this URL.

Next, open the following file:

```text
js/main.js
```

Locate the `fetch()` request (around **line 1400**) and replace the existing Worker URL with your newly generated Cloudflare Worker URL.

**Before**

```javascript
const response = await fetch(
  "https://dark-wave-2bc6.sivapr7223.workers.dev/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  },
);
```

**After**

```javascript
const response = await fetch(
  "https://your-project.workers.dev/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  },
);
```

> **Note**
>
> Replace `https://your-project.workers.dev/` with the Worker URL generated for your Cloudflare Worker. Otherwise, the message submission feature will not work.

# Configuration Guide


## 1. Recipient Name

Search for

```
[Girl_Name]
```

Replace it with the recipient's name.

---

## 2. Birthday Age

Replace every occurrence of

```
20
```

with the desired age.

---

## 3. Birthday Letter

Locate the birthday letter section.

Replace the existing text with your own message.

---

## 4. Memory Cards

Each memory consists of:

- Title
- Year
- Description
- Illustration

Replace them with your own memories.

---

## 5. Timeline

Edit the timeline entries to match your story.

You can add or remove entries without affecting the rest of the project.

---

## 6. Interactive Dialogue

Search for

```javascript
DialogQuestions
```

Each object contains:

```
text
buttons
exitMessage
hintMessage
```

Modify these to create your own conversation.

---

## 7. Final Story

Replace the confession section with your own story.

The typewriter animation automatically adapts to the new text.

---

## 8. Colors

Inside

```
css/styles.css
```

edit the CSS variables:

```css
:root
```

Example:

```
--paper
--marker-red
--pen-blue
--postit
--pencil
```

---

## 9. Fonts

Fonts are loaded from Google Fonts inside

```
index.html
```

Replace them with any font you prefer.

---

## 10. Animations

Animation timing is controlled through GSAP.

Search for

```
duration
```

inside `script.js`.

---

## 11. Sound

Sound effects are generated using the Web Audio API.

Look for

```javascript
SoundEffects
```

You can:

- Disable sounds
- Change frequencies
- Replace effects
- Add new sounds

No audio files are required.

---

## 12. Carousel

Slides can be added or removed by duplicating the existing HTML structure.

The navigation updates automatically.

---

## 13. Local Storage

Progress is stored automatically using

```
localStorage
```

Current saved data includes:

- Sound preference
- Dialogue progress
- Interaction state

---

## 14. Responsive Design

The project works on:

- Desktop
- Tablet
- Mobile

Most responsive styles are already included.

---

## 15. Deploy Updates

After making changes:

1. Save your changes.
2. Click **Deploy** in the Cloudflare Worker editor.
3. Refresh your website.

No additional configuration is required.

---

# Customization Checklist

- Change recipient name
- Update age
- Replace memories
- Edit birthday letter
- Modify dialogue
- Replace final confession
- Update colors
- Change fonts
- Add or remove timeline entries
- Deploy

---

# Browser Support

Tested on:

- Chrome
- Firefox
- Edge
- Safari
- Brave

---

# Notes

This project is intended to be highly customizable.

Although the default version is built as a birthday experience, the same structure can be adapted for:

- Anniversary
- Proposal
- Graduation
- Farewell
- Friendship Letter
- Valentine's Day
- Wedding Wishes

---

# License

MIT License.

Feel free to modify the project for personal use.

Attribution is appreciated but not required.