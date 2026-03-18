import paramiko

host = 'harmonylaundry.my.id'
port = 36786
username = 'patriot'
password = '05Juli!!'
remote_dir = '/home/patriot/kasir/kasir.harmonylaundry.my.id'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port, username, password)

commands = [
    f'cat {remote_dir}/docker-compose.yml',
    f'ls -la {remote_dir}'
]

for cmd in commands:
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode())
    print(stderr.read().decode())

ssh.close()
