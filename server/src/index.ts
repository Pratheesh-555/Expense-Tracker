import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
const port = process.env.PORT || 4000;

// Schemas
const BankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  initialBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const ExpenseSchema = new mongoose.Schema({
  bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' }
});

const Bank = mongoose.model('Bank', BankSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

// Routes
app.get('/banks', async (_req, res) => {
  const banks = await Bank.find().sort({ createdAt: 1 });
  res.json(banks.map(b => ({ id: b._id.toString(), name: b.name, createdAt: b.createdAt.getTime(), initialBalance: b.initialBalance })));
});

app.put('/banks', async (req, res) => {
  // Replace all banks with the provided list (id/name/initialBalance)
  const incoming = req.body as Array<{ id?: string; name: string; initialBalance: number }>; 
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await Bank.deleteMany({}).session(session);
    await Bank.insertMany(incoming.map(b => ({ _id: b.id, name: b.name, initialBalance: b.initialBalance })), { session });
  });
  res.json({ ok: true });
});

app.get('/banks/:bankId/expenses', async (req, res) => {
  const bankId = req.params.bankId;
  const docs = await Expense.find({ bankId }).sort({ date: 1, _id: 1 });
  res.json(docs.map(d => ({ id: d._id.toString(), amount: d.amount, category: d.category, description: d.description, date: d.date, type: d.type })));
});

app.put('/banks/:bankId/expenses', async (req, res) => {
  const bankId = req.params.bankId;
  const items = req.body as Array<{ id?: string; amount: number; category: string; description: string; date: string; type?: string }>;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await Expense.deleteMany({ bankId }).session(session);
    await Expense.insertMany(items.map(i => ({ _id: i.id, bankId, amount: i.amount, category: i.category, description: i.description, date: i.date, type: i.type ?? 'expense' })), { session });
  });
  res.json({ ok: true });
});

mongoose.connect(mongoUri).then(() => {
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});


