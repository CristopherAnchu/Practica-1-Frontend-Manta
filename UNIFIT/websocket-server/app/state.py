class ServerState:
    def __init__(self):
        self.rooms = {
            'dashboard': set(),
            'reservas': set(),
            'rutinas': set(),
            'usuarios': set(),
            'notifications': set()
        }
        self.connection_count = 0

state = ServerState()
