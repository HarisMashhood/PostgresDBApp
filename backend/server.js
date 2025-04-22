import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js'; // Import product routes
import { sql } from './config/db.js';
import Path from 'path';
// import { aj } from './lib/arcjet.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Set the port from environment variables or default to 3000
const __dirname = Path.resolve(); // Get the current directory path 


app.use(helmet(
    {
        contentSecurityPolicy: false, // Disable CSP for simplicity (not recommended for production)
    }
)); // Security middleware
app.use(morgan('dev')); // Logging middleware
app.use(express.json()); // Body parser middleware
app.use(cors()); // CORS middleware
// app.get('/', (req, res) => {
//     res.send('Hello from the test route!');
// })

//apply arcjet rate-limit to all routes
// app.use(async (req, resizeBy, next) => {
//     try {
//         const decision = await aj.protect(req, {
//             requested: 1, //specifies that each req consumes 1 token
//         });

//         if (decision.isDenied()) {
//             if (decision.reason.isRateLimit()) {
//                 res.status(429).json({ error: "Too Many Request" });
//             } 
//             else if (decision.reason.isBot()) {
//                 res.status(403).json({ error: "Bot access denied" });
//             } 
//             else {
//                 res.status(403).json({ error: "Forbidden" });
//             }
//             return;
//         }
//         next();
//     }
//     catch (error) {
//         console.log("Arcjet error", error);
//         nect(error);
//     }
// })



app.use('/api/products', productRoutes); // Product routes   


if (process.env.MODE === 'production') {
    app.use(express.static(Path.join(__dirname, '/frontend/dist'))); // Serve static files from the React frontend app
    app.get('*', (req, res) => {
        res.sendFile(Path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
image VARCHAR(255) NOT NULL,
price DECIMAL(10, 2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
        console.log('Database initialized successfully!');
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
})
