awaiting_password = False


def handle_command(command):
    global awaiting_password
    password = 1234567890
    command = command.strip()

    if awaiting_password:
        awaiting_password = False
        if str(command) == str(password):
            print('api=676767676767')
            return 'skibidi=67'
        return 'Incorrect password'

    if command == "pixeleyesd":
        return "Sub to Pixeleyesd!"
    elif command == "help":
        return "available commands: pixeleyesd, help, lsusb, ls, cat"
    elif command == "lsusb":
        return 'Bus 067 Device 607: ID 6bda: 6677 Sixty Seven Corp. Mass Skibidi Device'
    elif command == "ls":
        return 'HomeworkFolder   gaming.sh'
    elif command == "ls -a":
        return 'HomeworkFolder   gaming.sh   .wakatime-config'
    elif command == "cat gaming.sh":
        print('FILE="/HomeworkFolder/game.x86_64')
        print('echo "LAUNCHING SKIBIDI TOILET SIM"')
        print('echo "67"')
        print('if [ -f "$FILE" ]; then')
        print('    echo "GAME FOUND"')
        print('    "$FILE"')
        print('else')
        print('    echo "GAME NOT FOUND"')
        return 'fi'
    elif command == "ls /HomeworkFolder":
        print('Homework.mp4')
        return
    elif command == "ls /HomeworkFolder/":
        print('Homework.mp4')
        return
    elif command == "ls HomeworkFolder":
        print('Homework.mp4')
        return
    elif command == "ls HomeworkFolder/":
        print('Homework.mp4')
        return
    elif command == "ls -a /HomeworkFolder":
        print('Homework.mp4')
        return
    elif command == "ls -a /HomeworkFolder/":
        print('Homework.mp4')
        return
    elif command == "ls -a HomeworkFolder":
        print('Homework.mp4')
        return
    elif command == "ls -a HomeworkFolder/":
        print('Homework.mp4')
        return
    elif command == "./gaming.sh":
        print('LAUNCHING SKIBIDI TOILET SIM')
        print('67')
        return 'GAME NOT FOUND'
    elif command == "cat .wakatime-config":
        awaiting_password = True
        return 'Password:'
    elif command == "":
        return 'type "help" for a list of commands'
    else:
        print('type "help" for a list of commands')
        return "unknown command: " + command