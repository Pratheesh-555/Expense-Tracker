import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2 } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useChat } from '../contexts/ChatContext';
import { EXPENSE_CATEGORIES, normalizeCategory, isValidCategory } from '../constants/categories';
import { useBanks } from '../contexts/BankContext';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: () => void;
  onViewChange: (view: string) => void;
  isDarkMode: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ 
  isOpen, 
  onClose, 
  onAddExpense, 
  onViewChange, 
  isDarkMode 
}) => {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { expenses, addExpense } = useExpenses();
  const { messages, addMessage, isTyping, setIsTyping } = useChat();
  const { banks, currentBank, switchBank, addBank } = useBanks();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseAndHandleChat = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Quick helpers
    const extractAmount = (text: string): number | null => {
      const match = text.match(/(-?\d+(?:\.\d+)?)/);
      if (!match) return null;
      const value = parseFloat(match[1]);
      return isNaN(value) ? null : value;
    };

    const extractCategory = (text: string): string | null => {
      // Exact category word from known list
      const found = EXPENSE_CATEGORIES.find(cat =>
        new RegExp(`(^|\\b)${cat.toLowerCase()}(\\b|$)`).test(text)
      );
      return found ? found : null;
    };

    const formatCurrency = (n: number) => `₹${n.toFixed(2)}`;

    // Regex-based fast path
    const patterns = {
      addExpense: /^(?:add|spent|i\s+spent)\s+(?<amt>\d+(?:\.\d+)?)\s+(?<cat>[a-z ]+)$/i,
      addIncome: /^(?:add\s+income|received|credit)\s+(?<amt>\d+(?:\.\d+)?)\s+(?<cat>[a-z ]+)$/i,
      showTotal: /^show\s+total$/i,
      showCategory: /^show\s+(?<cat>[a-z ]+)$/i,
      addBank: /^add\s+bank\s+(?<name>[a-z0-9 ]+?)(?:\s+(?<open>\d+(?:\.\d+)?))?$/i,
      switchBank: /^switch\s+bank\s+(?<name>[a-z0-9 ]+)$/i
    } as const;

    // Add bank
    let m = userMessage.match(patterns.addBank);
    if (m && m.groups) {
      const name = m.groups.name.trim();
      const opening = m.groups.open ? parseFloat(m.groups.open) : 0;
      if (!name) return 'Please provide a bank name, e.g., Add bank SBI 5000';
      await addBank(name, isNaN(opening) ? 0 : opening);
      return `Created bank: ${name}${opening ? ` with opening balance ${formatCurrency(opening)}` : ''}.`;
    }

    // Switch bank
    m = userMessage.match(patterns.switchBank);
    if (m && m.groups) {
      const name = m.groups.name.trim();
      const target = banks.find(b => b.name.toLowerCase() === name.toLowerCase());
      if (!target) return `Bank "${name}" not found. Try: Add bank ${name}`;
      switchBank(target.id);
      return `Switched to bank: ${target.name}.`;
    }

    // Add income (strict)
    m = userMessage.match(patterns.addIncome);
    if (m && m.groups) {
      const amount = parseFloat(m.groups.amt);
      const rawCat = m.groups.cat.trim();
      const foundCategory = EXPENSE_CATEGORIES.find(c => c.toLowerCase() === rawCat.toLowerCase());
      if (!foundCategory) return `Unknown category "${rawCat}". Available: ${EXPENSE_CATEGORIES.join(', ')}`;
      if (!(amount > 0)) return 'Please provide a valid positive amount.';
      addExpense({ amount, category: foundCategory, description: `Added via chat: ${userMessage}`, date: new Date().toISOString().split('T')[0], type: 'income' });
      return `Recorded income ${formatCurrency(amount)} in ${foundCategory}${currentBank ? ` for ${currentBank.name}` : ''}.`;
    }

    // Add expense (strict)
    m = userMessage.match(patterns.addExpense);
    if (m && m.groups) {
      const amount = parseFloat(m.groups.amt);
      const rawCat = m.groups.cat.trim();
      const foundCategory = EXPENSE_CATEGORIES.find(c => c.toLowerCase() === rawCat.toLowerCase());
      if (!foundCategory) return `Unknown category "${rawCat}". Available: ${EXPENSE_CATEGORIES.join(', ')}`;
      if (!(amount > 0)) return 'Please provide a valid positive amount.';
      addExpense({ amount, category: foundCategory, description: `Added via chat: ${userMessage}`, date: new Date().toISOString().split('T')[0], type: 'expense' });
      return `Added ${formatCurrency(amount)} to ${foundCategory}${currentBank ? ` in ${currentBank.name}` : ''}.`;
    }

    // Show total
    if (patterns.showTotal.test(userMessage)) {
      const totalAll = expenses.reduce((sum, exp) => sum + ((exp.type ?? 'expense') === 'income' ? exp.amount : -exp.amount), 0);
      return `Current balance change${currentBank ? ` in ${currentBank.name}` : ''}: ${formatCurrency(totalAll)} (${expenses.length} transactions).`;
    }

    // Show category
    m = userMessage.match(patterns.showCategory);
    if (m && m.groups) {
      const rawCat = m.groups.cat.trim();
      const foundCategory = EXPENSE_CATEGORIES.find(c => c.toLowerCase() === rawCat.toLowerCase());
      if (!foundCategory) return `Unknown category "${rawCat}". Available: ${EXPENSE_CATEGORIES.join(', ')}`;
      const filtered = expenses.filter(exp => exp.category.toLowerCase() === foundCategory.toLowerCase());
      const inc = filtered.filter(e => (e.type ?? 'expense') === 'income').reduce((s, e) => s + e.amount, 0);
      const expTot = filtered.filter(e => (e.type ?? 'expense') === 'expense').reduce((s, e) => s + e.amount, 0);
      if (filtered.length === 0) return `No transactions for ${foundCategory}${currentBank ? ` in ${currentBank.name}` : ''}.`;
      return `${foundCategory}${currentBank ? ` in ${currentBank.name}` : ''}: Income ${formatCurrency(inc)}, Expense ${formatCurrency(expTot)}, Net ${formatCurrency(inc - expTot)} (${filtered.length} entries).`;
    }

    // Bank commands
    if (message.startsWith('switch bank')) {
      const name = userMessage.split(' ').slice(2).join(' ').trim();
      if (!name) return 'Please specify a bank name to switch to.';
      const target = banks.find(b => b.name.toLowerCase() === name.toLowerCase());
      if (!target) return `Bank "${name}" not found. You can create it: Add bank ${name}`;
      switchBank(target.id);
      return `Switched to bank: ${target.name}.`;
    }

    if (message.startsWith('add bank')) {
      const tokens = userMessage.split(' ').slice(2);
      const nameParts: string[] = [];
      let initial = 0;
      for (const t of tokens) {
        const asNum = parseFloat(t);
        if (!isNaN(asNum)) { initial = asNum; break; }
        nameParts.push(t);
      }
      const name = (nameParts.join(' ').trim() || `Bank ${banks.length + 1}`);
      await addBank(name, initial);
      return `Created bank: ${name} and switched to it.`;
    }

    if (message === 'current bank') {
      return currentBank ? `Current bank: ${currentBank.name}` : 'No bank selected';
    }

    // Navigation commands
    if (message.includes('dashboard') || message.includes('home')) {
      onViewChange('dashboard');
      return "I've taken you to the dashboard! Here you can see your spending overview, recent transactions, and budget progress.";
    }
    
    if (message.includes('transaction') || message.includes('history')) {
      onViewChange('transactions');
      return "Here are all your transactions! You can filter by expense/income, search for specific transactions, and see them organized by date.";
    }
    
    if (message.includes('analytics') || message.includes('analysis') || message.includes('chart')) {
      onViewChange('analytics');
      return "Let's look at your spending analytics! Here you can see category breakdowns, monthly trends, and detailed insights about your spending patterns.";
    }
    
    if (message.includes('budget') || message.includes('limit')) {
      if (message.includes('set') || message.includes('create') || message.includes('manage')) {
        onViewChange('budget');
        return "I've opened the budget manager for you! Here you can create new budgets, track your spending limits, and get alerts when you're approaching your limits.";
      }
      
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      });
      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const budget = 5000;
      const remaining = budget - monthTotal;
      
      return `This month you've spent ₹${monthTotal.toFixed(2)} out of your ₹${budget} budget. You have ₹${remaining.toFixed(2)} remaining. ${remaining < 1000 ? 'You might want to be more careful with spending!' : 'You\'re doing well!'}`;
    }
    
    if (message.includes('settings') || message.includes('profile')) {
      onViewChange('settings');
      return "I've opened your settings! Here you can update your profile, manage notifications, toggle dark mode, and handle data export/import.";
    }
    
    // Expense/Income management - Add
    if (
      message.startsWith('add ') ||
      message.includes(' i spent') ||
      message.includes('spent ') ||
      message.includes(' add ') ||
      message.includes('income') ||
      message.includes('received') ||
      message.includes('credit')
    ) {
      const amount = extractAmount(message);
      const foundCategory = extractCategory(message);
      const isIncome = message.includes('income') || message.includes('received') || message.includes('credit');

      if (!amount || amount <= 0) {
        return 'Please provide a valid positive amount. Example: Add 50 Food or Add income 500 Salary';
      }

      if (!foundCategory) {
        return `Which category is this for? Available: ${EXPENSE_CATEGORIES.join(', ')}`;
      }

      addExpense({
        amount,
        category: normalizeCategory(foundCategory),
        description: `Added via chat: ${userMessage}`,
        date: new Date().toISOString().split('T')[0],
        type: isIncome ? 'income' : 'expense'
      });
      return `${isIncome ? 'Recorded income' : 'Added'} ${formatCurrency(amount)} ${isIncome ? 'in' : 'to'} ${normalizeCategory(foundCategory)}${currentBank ? ` in ${currentBank.name}` : ''}.`;
    }
    
    // Insights and summaries - Total
    if (message.trim() === 'show total' || message.includes(' total')) {
      const totalAll = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      return `Your total expenses${currentBank ? ` in ${currentBank.name}` : ''} are ${formatCurrency(totalAll)} across ${expenses.length} transactions.`;
    }

    // Insights and summaries - Category total e.g., "show food"
    if (message.startsWith('show ')) {
      const maybeCategory = userMessage.slice(5).trim();
      if (maybeCategory && isValidCategory(maybeCategory)) {
        const categoryName = normalizeCategory(maybeCategory);
        const filtered = expenses.filter(exp => exp.category.toLowerCase() === categoryName.toLowerCase());
        const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
        return filtered.length === 0
          ? `No expenses found for ${categoryName}${currentBank ? ` in ${currentBank.name}` : ''}.`
          : `Total for ${categoryName}${currentBank ? ` in ${currentBank.name}` : ''}: ${formatCurrency(total)} across ${filtered.length} transactions.`;
      }
    }
    
    if (message.includes('category') || message.includes('breakdown')) {
      const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const topCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
      
      if (topCategories.length === 0) {
        return "You haven't added any expenses yet. Start tracking by telling me about your spending!";
      }
      
      return `Your top spending categories are: ${topCategories.map(([cat, amt]) => `${cat} (₹${amt.toFixed(2)})`).join(', ')}. Would you like to see detailed analytics?`;
    }
    
    if (message.includes('week') || message.includes('weekly')) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weekExpenses = expenses.filter(exp => new Date(exp.date) >= weekAgo);
      const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return `This week you've spent ₹${weekTotal.toFixed(2)} across ${weekExpenses.length} transactions. Your daily average is ₹${(weekTotal / 7).toFixed(2)}.`;
    }
    
    if (message.includes('month') || message.includes('monthly')) {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      });
      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return `This month you've spent ₹${monthTotal.toFixed(2)} across ${monthExpenses.length} transactions. That's an average of ₹${(monthTotal / new Date().getDate()).toFixed(2)} per day.`;
    }
    
    // Feature explanations
    if (message.includes('feature') || message.includes('what can') || message.includes('how to')) {
      return `I can help you with:

💰 **Expense Tracking**: Say "I spent 50 on canteen" to add expenses
📊 **Analytics**: Ask for "category breakdown" or "monthly summary"  
🎯 **Budget Management**: Check your "budget status" or "set budget limits"
📱 **Navigation**: Say "go to dashboard", "show transactions", or "open settings"
📈 **Insights**: Ask for "weekly spending" or "top categories"

What would you like to explore?`;
    }
    
    // Greetings and help
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm your SASTRA University expense tracking assistant. I can help you manage your finances, add expenses, analyze spending patterns, and navigate the app. Try saying 'I spent 50 on canteen' or 'show me my budget status'!";
    }
    
    if (message.includes('help')) {
      return `I can help you with:

📝 **Adding Expenses**: "I spent 30 on auto", "Add 50 for canteen"
📊 **View Analytics**: "Show analytics", "Category breakdown"  
💳 **Check Transactions**: "Show my transactions", "Transaction history"
🎯 **Budget Tracking**: "Budget status", "Set budget limits"
🏠 **Navigation**: "Go to dashboard", "Open settings"
📈 **Spending Insights**: "Weekly summary", "Monthly total"

What would you like to do?`;
    }
    
    // App-specific help
    if (message.includes('sastra') || message.includes('university') || message.includes('student')) {
      return "This expense tracker is designed specifically for SASTRA University students! I understand common student expenses like canteen food, auto rides, books, mess charges, and more. I can help you manage your monthly allowance and track spending patterns typical for university life.";
    }
    
    if (message.includes('dark mode') || message.includes('theme')) {
      return "You can toggle between light and dark themes! Click the sun/moon icon in the header, or go to Settings to change your appearance preferences.";
    }
    
    // Default response
    return "I can add expenses (e.g., 'Add 50 Food'), show totals ('Show total'), or show category totals ('Show Food')."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    addMessage({ type: 'user', content: userMessage });
    setIsTyping(true);
    
    try {
      const response = await parseAndHandleChat(userMessage);
      addMessage({ type: 'bot', content: response });
    } catch (error) {
      addMessage({ 
        type: 'bot', 
        content: "Sorry, I encountered an error. Please try again!" 
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      } ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Expense Assistant</h3>
              <p className="text-xs text-blue-100">Always here to help</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto h-64">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Hi! I'm your SASTRA expense assistant. I can help you track spending, analyze patterns, and navigate the app!
                  </p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-100' 
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-100' 
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Bot className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                      }`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                      }`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about expenses..."
                  className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};