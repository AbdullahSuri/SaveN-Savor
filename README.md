

SaveN'Savor is a sustainable food-sharing app that connects vendors with surplus food to consumers looking for affordable meals. This repository contains the user-side implementation of the application.

🌟 Features

- Browse and search surplus food listings  
- View item details and pickup information  
- Place and track orders  
- Secure payment integration  
- Location-based search using geolocation  
- Track your environmental impact  

🛠 Tech Stack

- Frontend Framework: Next.js  
- Styling: Tailwind CSS  
- State Management: Redux / Context API (as applicable)  
- Mobile Support: Expo (React Native)  
- Database: MongoDB  
- APIs & Integrations:  
  - Stripe or PayPal (for payments)  
  - Google Maps API (for geolocation)  

📁 Project Structure

SaveN-Savor/
├── save-n-savor-use-side/
├── vendor
├── backend

🚀 How to Compile and Run

SaveN'Savor – User Side

1. Clone the Repository

git clone https://github.com/AbdullahSuri/SaveN-Savor.git

2. Navigate to the User-Side App Directory

cd SaveN-Savor/save-n-savor-use-side

3. Install Dependencies

npm install
npm install mongodb --legacy-peer-deps
npm install -g expo-cli
yarn install

4. Run the Development Server

npx next dev

SaveN'Savor – Vendor side
cd SaveN-Savor/vendor

3. Install Dependencies (besides the previous ones for user side)
yarn add typescript @types/react @types/node --dev

4. Run the Development Server

npx next dev

📌 Notes

- Make sure you have Node.js, npm, and yarn installed on your system.  
- Use expo-cli for mobile builds if needed.  

📬 Contact

For questions, please open an issue or contact the maintainer.

© 2025 SaveN'Savor – All rights reserved.
