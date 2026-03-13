#!/bin/bash
echo ""
echo "  ==================================="
echo "   DeenHub PWA - Starting Server..."
echo "  ==================================="
echo ""
echo "  Opening DeenHub in your browser..."
echo "  Press Ctrl+C to stop the server."
echo ""
open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null || start http://localhost:8000
python3 -m http.server 8000
