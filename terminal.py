def handle_command(command):
    command = command.strip()
    if command == "hi":
        return "hello there!"
    elif command == "help":
        return "available commands: hi, help"
    elif command == "":
        return 'type "help" for a list of commands'
    else:
        print('type "help" for a list of commands')
        return "unknown command: " + command