import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import cron from "node-cron";
import twilio from "twilio";

dotenv.config();

// Create PostgreSQL client
const db = new pg.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,    
});

const port = 3000;
const app = express();

// Connect to PostgreSQL with error handling
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1); 
    });

app.use(cors());
app.use(bodyParser.json());

// Signup Route
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            "INSERT INTO auth (username, password_hash) VALUES ($1, $2) RETURNING id",
            [username, hashedPassword]
        );

        res.json({ success: true, userId: result.rows[0].id });
    } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query("SELECT * FROM auth WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        res.json({ success: true, userId: user.id });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

app.post("/add-info", async (req, res) => {
    const { userId, name, age, phoneNumber, caregiverPhone, medications } = req.body;
    try {
        const userResult = await db.query(
            "INSERT INTO user_details (auth_id, name, age, phone_number, caregiver_phone) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [userId, name, age, phoneNumber, caregiverPhone || null]
        );

        const userDetailsId = userResult.rows[0].id;

        for (let med of medications) {
            await db.query(
                "INSERT INTO medications (user_id, medicine_name, dosage_timing, pills_per_dose, pills_available) VALUES ($1, $2, $3, $4, $5)",
                [userDetailsId, med.medicineName, med.timing, med.pillsPerDose, med.pillsAvailable]
            );
        }

        res.json({ success: true, message: "User data and medications saved successfully." });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ success: false, message: "Failed to save user data." });
    }
});

app.get("/medications", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM medications");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching medications:", err);
        res.status(500).json({ success: false, message: "Failed to retrieve medications" });
    }
});

app.post("/medications", async (req, res) => {
    const { user_id, medicine_name, dosage_timing, pills_per_dose, pills_available } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO medications (user_id, medicine_name, dosage_timing, pills_per_dose, pills_available) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, medicine_name, dosage_timing, pills_per_dose, pills_available]
        );
        res.json({ success: true, medication: result.rows[0] });
    } catch (err) {
        console.error("Error adding medication:", err);
        res.status(500).json({ success: false, message: "Failed to add medication" });
    }
});

app.put("/medications/:id", async (req, res) => {
    const { id } = req.params;
    const { medicine_name, dosage_timing, pills_per_dose, pills_available } = req.body;

    try {
        const result = await db.query(
            "UPDATE medications SET medicine_name=$1, dosage_timing=$2, pills_per_dose=$3, pills_available=$4 WHERE id=$5 RETURNING *",
            [medicine_name, dosage_timing, pills_per_dose, pills_available, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Medication not found" });
        }

        res.json({ success: true, medication: result.rows[0] });
    } catch (err) {
        console.error("Error updating medication:", err);
        res.status(500).json({ success: false, message: "Failed to update medication" });
    }
});

app.delete("/medications/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("DELETE FROM medications WHERE id=$1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Medication not found" });
        }

        res.json({ success: true, message: "Medication deleted successfully" });
    } catch (err) {
        console.error("Error deleting medication:", err);
        res.status(500).json({ success: false, message: "Failed to delete medication" });
    }
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

async function sendSMSReminder(phone, message) {
    try {
        await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log(`SMS sent to ${phone}`);
    } catch (error) {
        console.error(`Failed to send SMS to ${phone}:`, error);
    }
}

async function sendVoiceReminder(phone, message) {
    try {
        await twilioClient.calls.create({
            twiml: `<Response><Say>${message}</Say></Response>`,
            from: TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log(`Voice call initiated to ${phone}`);
    } catch (error) {
        console.error(`Failed to make voice call to ${phone}:`, error);
    }
}

cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour}:${currentMinute}`;

        const result = await db.query(`
            SELECT u.phone_number, u.caregiver_phone, m.medicine_name, m.dosage_timing 
            FROM user_details u
            JOIN medications m ON u.id = m.user_id
            WHERE m.dosage_timing = $1
        `, [currentTime]);

        for (const row of result.rows) {
            const message = `Reminder: It's time to take your medication - ${row.medicine_name}.`;
            
            if (row.phone_number) {
                sendSMSReminder(row.phone_number, message);
                sendVoiceReminder(row.phone_number, message);
            }

            if (row.caregiver_phone) {
                sendSMSReminder(row.caregiver_phone, `Caregiver Alert: ${message}`);
                sendVoiceReminder(row.caregiver_phone, `Caregiver Alert: ${message}`);
            }
        }
    } catch (error) {
        console.error("Error checking medication reminders:", error);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
