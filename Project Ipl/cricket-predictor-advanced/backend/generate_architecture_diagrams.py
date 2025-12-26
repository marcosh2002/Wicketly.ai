# IPL Cricket Predictor System Architecture
# This script generates a system architecture diagram and workflow as PNG images using graphviz.

from graphviz import Digraph

# System Architecture Diagram
g_arch = Digraph('G', filename='system_architecture', format='png')
g_arch.attr(rankdir='LR', size='8,5')

g_arch.node('A', 'React Frontend')
g_arch.node('B', 'Backend API (FastAPI)')
g_arch.node('C', 'Auth Service (FastAPI)')
g_arch.node('D', 'SQLite DB (cricket_auth.db)')
g_arch.node('E', 'Match/Stats Data Files (CSV/JSON)')
g_arch.node('F', 'Backup Script')

g_arch.edge('A', 'B', label='HTTP')
g_arch.edge('B', 'C', label='HTTP')
g_arch.edge('C', 'D', label='SQL')
g_arch.edge('B', 'E', label='File IO')
g_arch.edge('F', 'D', label='File Copy')

g_arch.render(directory='.', view=False)

# Project Workflow Flowchart
g_flow = Digraph('H', filename='project_workflow', format='png')
g_flow.attr(rankdir='TB', size='8,10')

g_flow.node('Start', 'User Action')
g_flow.node('Login', 'Login/Register')
g_flow.node('Token', 'Receive Token')
g_flow.node('Action', 'Spin/Predict/View Stats')
g_flow.node('SpinReq', 'Spin Request')
g_flow.node('AuthCheck', 'Auth Service: Check Spin')
g_flow.node('SpinResult', 'Spin Result/Jackpot')
g_flow.node('PredictReq', 'Prediction Request')
g_flow.node('Backend', 'Backend API: Process Prediction')
g_flow.node('PredictResult', 'Prediction Result')
g_flow.node('StatsReq', 'Stats Request')
g_flow.node('BackendStats', 'Backend API: Fetch Stats')
g_flow.node('StatsResult', 'Stats Result')
g_flow.node('Backup', 'Backup Script')
g_flow.node('DB', 'SQLite DB')

g_flow.edges([('Start','Login'), ('Login','Token'), ('Token','Action')])
g_flow.edge('Action','SpinReq', label='Spin')
g_flow.edge('SpinReq','AuthCheck')
g_flow.edge('AuthCheck','SpinResult', label='Allowed')
g_flow.edge('Action','PredictReq', label='Predict')
g_flow.edge('PredictReq','Backend')
g_flow.edge('Backend','PredictResult')
g_flow.edge('Action','StatsReq', label='Stats')
g_flow.edge('StatsReq','BackendStats')
g_flow.edge('BackendStats','StatsResult')
g_flow.edge('Backup','DB')

g_flow.render(directory='.', view=False)
print('System architecture and workflow diagrams generated as PNG files.')
