filename = "sql_measurement.txt"

log = open(filename, "r")
lines = log.readlines()
times = []
for line in lines:
    if "Time:" in line:
        times.append(float((line[line.find(' ') + 1:line.rfind(' ')]).replace(',', '.')))
print('Average time (sql):', sum(times) / len(times))
