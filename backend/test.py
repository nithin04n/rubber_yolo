import os

path = os.path.join(os.path.dirname(__file__), 'weights', 'best.pt')
print(f"🔎 Looking for: {path}")
print("✅ Exists?" if os.path.exists(path) else "❌ File not found")
