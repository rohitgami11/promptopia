# 📖 Promptopia — AI Prompt Sharing Platform

## 📌 Overview

Promptopia is a full-stack, modern web application where users can discover, share, and manage AI prompts. The platform enables authenticated users to create, edit, delete, and search for prompts on various topics and use cases — whether for ChatGPT, image generation, or any other AI system.

---

## 📌 Key Features

- 🔐 **Secure Authentication** using **NextAuth.js** with Google OAuth.
- 📚 **Create, Read, Update, Delete (CRUD)** operations for prompts.
- 📝 **Tag-based and Text-based Search** for easy discovery of relevant prompts.
- 📈 **Dynamic, Cursor-based Pagination** for efficient navigation with large datasets.
- 💾 **MongoDB Database Integration** for prompt storage and user data.
- ⚡ **Responsive, Clean UI** built with Tailwind CSS.
- 🌐 **Deployed on Vercel** for seamless CI/CD and production hosting.

---

## 📌 Tech Stack

| Technology                  | Role                              |
|:----------------------------|:----------------------------------|
| **Next.js 14 (App Router)**  | Frontend & Backend API Routes     |
| **NextAuth.js**              | Secure OAuth-based Authentication |
| **MongoDB Atlas**            | Cloud-hosted NoSQL Database       |
| **Mongoose ODM**             | Data modeling and query handling  |
| **Tailwind CSS**             | Modern utility-first CSS framework|
| **Vercel**                   | CI/CD Deployment & Hosting        |

---

## 📌 Core Functionalities

✅ **User Authentication:**  
Users can sign in with Google OAuth to create and manage their prompts.

✅ **Prompt Management:**  
Authenticated users can:
- Create new prompts
- Edit existing prompts
- Delete their prompts  
Each prompt includes content and multiple searchable tags.

✅ **Advanced Search:**
- **Tag-based Filtering**
- **Full-text Regex Search** across prompt content.

✅ **Cursor-Based Pagination:**  
Efficiently handle datasets at scale, replacing skip-limit pagination with a performant, index-friendly cursor pagination system.

✅ **Responsive UI:**  
Fully mobile-responsive with clean layouts and minimalistic design.

---

## 📌 Project Architecture Overview

- Frontend: Next.js 14 (App Directory)
- Backend: Next.js API Routes
- Database: MongoDB Atlas
- Authentication: NextAuth.js (Google)
- Deployment: Vercel


---

## 📌 Deployed Link

👉 [Promptopia Live](https://promptopia-gami.vercel.app)

---

## 📌 Future Enhancements

- Integrate Redis-based caching for hot prompt searches.
- Enable likes/upvotes and comment functionality.
- Add a notification system for prompt interactions.
- Migrate to a microservices architecture (optional future case study).
- Move infrastructure and deployment to cloud services like **Azure** or **AWS** for scalable, resilient, production-grade hosting.

---

## 📌 Author

**Rohit Gami**  
🔗 [GitHub](https://github.com/rohitgami11)