# Testing Checklist

## Manual Tests

- [ ] Register new user with valid credentials
- [ ] Register fails with duplicate email
- [ ] Login with valid credentials
- [ ] Login fails with wrong password
- [ ] Protected routes redirect to login when logged out
- [ ] Create new chat from dashboard
- [ ] Send message via Socket.IO and receive AI response
- [ ] Quick symptom chips send messages
- [ ] Chat history persists after page reload
- [ ] Delete chat removes from sidebar
- [ ] Typing indicator shows while AI is thinking
- [ ] Medicine suggestions render in assistant messages
- [ ] Doctor cards render in assistant messages
- [ ] High urgency symptoms show warning banner
- [ ] Mobile sidebar opens and closes
- [ ] Logout clears session

## API Tests (curl / Postman)

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Demo Script (Presentation)

1. Show disclaimer banner
2. Register a new account
3. Click "Headache" symptom chip
4. Show AI response with health tips and doctor recommendations
5. Open sidebar, create second chat
6. Type "I have chest pain" to demonstrate urgency handling
7. Logout and login again to show chat history persistence
