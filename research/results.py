import numpy as np
import matplotlib.pyplot as plt

ways = np.array(['SQL', 'ORM', 'Query Builder'])
total = np.array([1.78186,  2.8448023496568204, 12.797937990003847])
sql = np.array([0, 1.962369820177555, 11.716181030001607])

plt.bar(ways, total, color='red', label='Общее время выполнения')
plt.bar(ways, sql, color='blue', label='Время выполнения SQL')
plt.ylabel('Время выполнения, мс')
plt.legend()
plt.show()