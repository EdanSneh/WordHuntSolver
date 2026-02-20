"""Entry point for PyInstaller-bundled backend server."""
import sys
import os

# When frozen by PyInstaller, bundled data files live under sys._MEIPASS
if getattr(sys, 'frozen', False):
    os.environ['WORDHUNT_DATA_DIR'] = os.path.join(sys._MEIPASS, 'data')

import uvicorn
from app import app

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    uvicorn.run(app, host='127.0.0.1', port=port)
