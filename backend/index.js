const express    = require("express");
const mongoose   = require("mongoose");
const dotenv     = require("dotenv");
const cors       = require("cors");
const bcrypt     = require("bcrypt");
const jwt        = require("jsonwebtoken");

const User           = require("./models/User");
const Expense        = require("./models/Expense");
const authMiddleware = require("./middleware/auth");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ── DB Connect ───────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// ── POST /register ───────────────────────────────────────
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /login ──────────────────────────────────────────
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /expense (Protected) ────────────────────────────
app.post("/expense", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });
    await expense.save();
    res.status(201).json({ message: "Expense Added", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /expenses (Protected) ────────────────────────────
app.get("/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ─────────────────────────────────────────
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);