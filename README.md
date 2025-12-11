# English Toxic Comment Detection Backend

Node.js backend for detecting toxic comments in English using HuggingFace's `unitary/toxic-bert` model.

## 🎯 Features

- **Multi-label Toxicity Detection**: Detects 6 types of toxicity
  - `toxic` - General toxicity
  - `severe_toxic` - Severe toxic content
  - `obscene` - Obscene language
  - `threat` - Threatening language
  - `insult` - Insulting content
  - `identity_hate` - Identity-based hate speech

- **RESTful API**: Simple POST endpoint for Flutter app integration
- **HuggingFace Integration**: Uses official Inference API
- **Error Handling**: Robust error handling for API failures

## 📋 Prerequisites

- Node.js 16+ installed
- HuggingFace API token

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file (already configured):
```
HF_TOKEN=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
PORT=3000
```

### 3. Start Server

```bash
npm start
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### Health Check

```bash
GET /
```

**Response:**
```json
{
  "status": "ok",
  "message": "English Toxic Detection API Running",
  "model": "unitary/toxic-bert"
}
```

### Detect Toxic Content

```bash
POST /detect-toxic
Content-Type: application/json

{
  "text": "Your comment text here"
}
```

**Response:**
```json
{
  "toxic": 0.98,
  "severe_toxic": 0.02,
  "obscene": 0.01,
  "threat": 0.00,
  "insult": 0.05,
  "identity_hate": 0.00
}
```

**Error Response (400):**
```json
{
  "error": "text_required"
}
```

**Error Response (500):**
```json
{
  "error": "internal_server_error",
  "message": "Error details"
}
```

## 🧪 Testing

### Test with curl

**Toxic Comment:**
```bash
curl -X POST http://localhost:3000/detect-toxic -H "Content-Type: application/json" -d "{\"text\": \"You are stupid and I hate you\"}"
```

**Non-Toxic Comment:**
```bash
curl -X POST http://localhost:3000/detect-toxic -H "Content-Type: application/json" -d "{\"text\": \"Have a great day!\"}"
```

**Empty Text (Error):**
```bash
curl -X POST http://localhost:3000/detect-toxic -H "Content-Type: application/json" -d "{\"text\": \"\"}"
```

## 🔗 Flutter Integration

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> detectToxic(String text) async {
  final response = await http.post(
    Uri.parse('http://localhost:3000/detect-toxic'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'text': text}),
  );
  
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to detect toxic content');
  }
}

// Usage
final result = await detectToxic("Your comment here");
print('Toxic score: ${result['toxic']}');
print('Insult score: ${result['insult']}');
```

## 📁 Project Structure

```
toxic_detection_backend/
├── server.js           # Main Express server
├── package.json        # Node.js dependencies
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

Uses `nodemon` for auto-restart on file changes.

### Environment Variables

- `HF_TOKEN` - HuggingFace API token (required)
- `PORT` - Server port (default: 3000)

## 🔧 Troubleshooting

### "text_required" Error
- Ensure you're sending a non-empty `text` field in the request body

### "huggingface_api_error"
- Check your HuggingFace API token is valid
- Verify you have API access (not rate-limited)
- Check HuggingFace service status

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3000

## 📝 Model Information

**Model:** `unitary/toxic-bert`
**Type:** Multi-label text classification
**Labels:** toxic, severe_toxic, obscene, threat, insult, identity_hate
**Language:** English

## 🔄 Migration from Roman Urdu

This backend replaces the previous Roman Urdu toxic detection system. Key changes:

- ✅ Model changed from `syedmuhammadwaqas/roman-urdu-toxic-model` to `unitary/toxic-bert`
- ✅ Response format changed to multi-label scores
- ✅ Removed Python dependencies
- ✅ Simplified to Node.js only

## 📄 License

MIT License - UPRSpace Team
