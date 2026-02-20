# -*- mode: python ; coding: utf-8 -*-

import os

backend_dir = os.path.abspath('backend')
data_dir = os.path.abspath('data')

a = Analysis(
    [os.path.join(backend_dir, 'run_server.py')],
    pathex=[backend_dir],
    datas=[
        (data_dir, 'data'),
    ],
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'uvicorn.lifespan.off',
        'app',
        'app.routes',
        'app.models',
        'solver',
        'solver.solver',
        'solver.trie',
    ],
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='wordhunt-backend',
    debug=False,
    strip=False,
    upx=True,
    console=True,
)
