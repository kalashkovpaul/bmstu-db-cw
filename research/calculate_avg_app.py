filename = "../backend/log/app.log"

log = open(filename, "r")
lines = log.readlines()
full_times = []
sql_times = []
for line in lines:
    if "1.1:" in line:
        full_times.append(float(line[line.rfind(' '):]))
    elif "1.2:" in line:
        sql_times.append(float(line[line.rfind(' '):]))
print('Average full time (app):', sum(full_times) / len(full_times))
print('Time spent doing sql (app):', sum(sql_times) / len(sql_times))