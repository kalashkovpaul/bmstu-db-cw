import matplotlib.pyplot as plt
x = [10, 100, 1000, 10000, 100000, 1000000]
y = [1.1, 2.07, 8.5, 80.43, 946.73, 8780.69]
plt.plot(x, y, '--bo', label='Время обработки программы')
plt.ylabel('Время, мс')
plt.xlabel('Количество полей')
# plt.xticks([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
plt.legend()
plt.show()